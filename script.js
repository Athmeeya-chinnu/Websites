const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");
const container3 = document.querySelector(".container3");
const emailAdress = document.getElementById("emailAdress");
const verifyemail = document.getElementById("verifyEmail");
const inputs = document.querySelectorAll(".otps input");
const mybutton = document.querySelector(".mybutton");
const verifybutton = document.querySelector(".verifybutton");
const emailForm = document.querySelector(".otpForm");
const otpForm = document.querySelector(".otp-Form");
const emailStatus = document.getElementById("emailStatus");
const otpStatus = document.getElementById("otpStatus");
const resendbutton = document.querySelector(".resendbutton");
const changeEmailButton = document.querySelector(".changeEmailButton");

if (!container1 || !container2 || !container3 || !emailAdress || !verifyemail || !mybutton || !verifybutton || !emailForm || !otpForm || !emailStatus || !otpStatus || !resendbutton || !changeEmailButton) {
    console.error("One or more OTP form elements are missing from the page.");
} else {
    window.addEventListener("load", () => {
        container2.hidden = true;
        container3.hidden = true;
        mybutton.classList.add("disable");
        verifybutton.classList.add("disable");
    });

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        mybutton.disabled = !isValid;
        mybutton.classList.toggle("disable", !isValid);
        return isValid;
    };

    emailAdress.addEventListener("input", () => validateEmail(emailAdress.value.trim()));
    mybutton.disabled = true;
    verifybutton.disabled = true;

    let activeEmail = "";

    const setStatus = (element, message, state = "") => {
        element.textContent = message;
        element.dataset.state = state;
    };

    const postJson = async (url, body) => {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Request failed. Please try again.");
        return result;
    };

    const sendOtp = async (email) => {
        mybutton.disabled = true;
        resendbutton.disabled = true;
        setStatus(emailStatus, "Sending your OTP...", "loading");
        setStatus(otpStatus, "Sending your OTP...", "loading");

        try {
            const result = await postJson("/send-otp", { email });
            activeEmail = email;
            verifyemail.textContent = email;
            container1.hidden = true;
            container3.hidden = true;
            container2.hidden = false;
            inputs.forEach((input) => { input.value = ""; });
            verifybutton.disabled = true;

            const message = result.developmentOtp
                ? `${result.message} Code: ${result.developmentOtp}`
                : result.message;
            setStatus(otpStatus, message, "success");
            inputs[0].focus();
        } catch (error) {
            setStatus(emailStatus, error.message, "error");
            setStatus(otpStatus, error.message, "error");
        } finally {
            mybutton.disabled = false;
            resendbutton.disabled = false;
        }
    };

    emailForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (emailForm.reportValidity()) sendOtp(emailAdress.value.trim().toLowerCase());
    });

    inputs.forEach((input, index) => {
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(-1);
            if (input.value && index < inputs.length - 1) inputs[index + 1].focus();
            verifybutton.disabled = [...inputs].some((digit) => !digit.value);
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && !input.value && index > 0) inputs[index - 1].focus();
        });
        input.addEventListener("paste", (event) => {
            const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, inputs.length);
            if (!digits) return;
            event.preventDefault();
            [...digits].forEach((digit, digitIndex) => { inputs[digitIndex].value = digit; });
            inputs[Math.min(digits.length, inputs.length - 1)].focus();
            verifybutton.disabled = [...inputs].some((digit) => !digit.value);
        });
    });

    otpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const otp = [...inputs].map((input) => input.value).join("");
        if (otp.length !== inputs.length) return;

        verifybutton.disabled = true;
        setStatus(otpStatus, "Verifying your OTP...", "loading");
        try {
            await postJson("/verify-otp", { email: activeEmail, otp });
            container2.hidden = true;
            container3.hidden = false;
        } catch (error) {
            setStatus(otpStatus, error.message, "error");
            inputs.forEach((input) => { input.value = ""; });
            inputs[0].focus();
        } finally {
            verifybutton.disabled = [...inputs].some((digit) => !digit.value);
        }
    });

    resendbutton.addEventListener("click", () => sendOtp(activeEmail));
    changeEmailButton.addEventListener("click", () => {
        container2.hidden = true;
        container1.hidden = false;
        setStatus(emailStatus, "", "");
        emailAdress.focus();
    });
}