import express from 'express';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const app = express();
const port = Number(process.env.PORT) || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

const otpStore = new Map();
const otpLifetimeMs = 5 * 60 * 1000;
const maxOtpAttempts = 5;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOtp() {
  return String(randomInt(1000, 10000));
}

app.post('/send-otp', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  if (!hasEmailCredentials && process.env.NODE_ENV === 'production') {
    return res.status(500).json({ success: false, message: 'Email delivery is not configured.' });
  }

  const otp = generateOtp();
  otpStore.set(email, { code: otp, expiresAt: Date.now() + otpLifetimeMs, attempts: 0 });

  try {
    if (!hasEmailCredentials) {
      console.log(`Development OTP for ${email}: ${otp}`);
      return res.json({
        success: true,
        message: 'Email is not configured. Use this development OTP; it expires in 5 minutes.',
        developmentOtp: otp,
      });
    }

    await transporter.sendMail({
      from: `OTP Verification <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    return res.json({
      success: true,
      message: 'OTP sent successfully. It expires in 5 minutes.',
    });
  } catch (error) {
    otpStore.delete(email);
    console.error('Email send failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not send the OTP email. Check SMTP settings.',
    });
  }
});

app.post('/verify-otp', (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : '';

  if (!email || !/^\d{4}$/.test(otp)) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const savedOtp = otpStore.get(email);

  if (!savedOtp) {
    return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
  }

  if (Date.now() > savedOtp.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
  }

  savedOtp.attempts += 1;
  if (savedOtp.code === otp) {
    otpStore.delete(email);
    return res.json({ success: true, message: 'OTP verified successfully.' });
  }

  if (savedOtp.attempts >= maxOtpAttempts) {
    otpStore.delete(email);
    return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
  }

  return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
