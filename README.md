# Websites
In this repository the login and website related projects are here.
# 🔐 OTP Generator with Email Verification

A simple and interactive **OTP (One-Time Password) Email Verification System** built using **HTML, CSS, JavaScript, Node.js, Express.js, and Nodemailer**.

The application allows users to enter their email address, receive a 4-digit OTP through email, and verify the OTP to complete the authentication process.

## 🚀 Features

* 📧 Email-based OTP generation
* 🔢 Generates a secure 4-digit OTP
* ⏱️ OTP expires after 5 minutes
* 🔄 Resend OTP functionality
* 🔐 OTP verification with limited attempts
* 🚫 Prevents verification after too many incorrect attempts
* ✅ Success screen after successful verification
* 📱 Responsive user interface
* ⚠️ Validation for invalid email addresses
* 🔒 Environment variables for email credentials
* 📨 Email delivery using Nodemailer

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* Nodemailer

### Other Tools

* dotenv
* CORS
* Crypto module
* npm

The project configuration uses Express, Nodemailer, dotenv and CORS, with Node.js as the application runtime.

## 📂 Project Structure

```text
otp-email-login/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## 🔄 How It Works

```text
User enters email
        ↓
Click "Send OTP"
        ↓
Backend generates 4-digit OTP
        ↓
OTP sent to user's email
        ↓
User enters OTP
        ↓
Backend verifies OTP
        ↓
   ┌───────────────┐
   │ Correct OTP?  │
   └───────┬───────┘
       Yes ↓     ↓ No
     Success    Retry
```

## 🔐 OTP Security

The application includes several verification controls:

* OTP is stored temporarily on the server.
* OTP expires after **5 minutes**.
* Maximum verification attempts are limited to **5 attempts**.
* The OTP is removed after successful verification.
* Expired OTPs are automatically rejected.

These controls are implemented in the Node.js backend.

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/otp-email-login.git
```

### 2. Navigate to the Project

```bash
cd otp-email-login
```

### 3. Install Dependencies

```bash
npm install
```

The project uses the following main packages:

```text
express
nodemailer
dotenv
cors
```

### 4. Configure Email

Create a `.env` file in the project root:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3001
```

**Important:** Do not upload your `.env` file or email credentials to GitHub.

### 5. Start the Server

```bash
npm start
```

The project is configured to start the Node.js server using:

```bash
node server.js
```

### 6. Open the Application

Open:

```text
http://localhost:3001
```

## 📧 Email Verification Flow

1. Enter a valid email address.
2. Click **Send OTP**.
3. A 4-digit OTP is generated.
4. The OTP is sent to the provided email address.
5. Enter the received OTP.
6. Click **Verify OTP**.
7. If the OTP is correct, the verification-success screen is displayed.

The frontend contains separate screens for entering the email, entering the OTP, and displaying successful verification.

## 🧠 What I Learned

Through this project, I practiced:

* Frontend form handling
* JavaScript DOM manipulation
* REST API communication
* Node.js and Express.js
* Email integration using Nodemailer
* OTP generation and validation
* Error handling
* Environment variable configuration
* Basic authentication concepts
* Responsive UI development

## 🔮 Future Enhancements

Possible improvements include:

* User registration and login
* Database integration
* OTP rate limiting
* Passwordless authentication
* JWT-based authentication
* CAPTCHA integration
* User session management
* Improved email templates
* Deployment to a cloud platform

## 👩‍💻 Author

**Athmeeya Lakshmi C K**

Computer Science Engineering Graduate / Fresher

### ⭐ If you find this project useful

Feel free to explore the repository, give it a ⭐, and connect with me on LinkedIn.
