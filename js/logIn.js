document.addEventListener("DOMContentLoaded", function () {
    const signInForm = document.getElementById("signInForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const terms = document.getElementById("terms");
    const togglePassword = document.getElementById("togglePassword");

    const toastEl = document.querySelector(".toast"); 
    const toast = new bootstrap.Toast(toastEl);


    email.addEventListener("input", function () {
    const emailValidation = document.getElementById("emailValidation");
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email.value.trim() === "") {
        email.classList.add("is-invalid", "custom-invalid");
        emailValidation.textContent = "Email is required.";
        emailValidation.style.display = "block";
    } else if (!emailRegex.test(email.value.trim())) {
        email.classList.add("is-invalid", "custom-invalid");
        emailValidation.textContent = "(user@example.com)";
        emailValidation.style.display = "block";
    } else {
        email.classList.remove("is-invalid", "custom-invalid");
        emailValidation.style.display = "none";
    }
    });

    password.addEventListener("input", function () {
    const passwordValidation = document.getElementById("passwordValidation");
    const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (password.value.trim() === "") {
        password.classList.add("is-invalid", "custom-invalid");
        passwordValidation.textContent = "Password is required.";
        passwordValidation.style.display = "block";
    } else if (!passwordRegex.test(password.value.trim())) {
        password.classList.add("is-invalid", "custom-invalid");
        passwordValidation.textContent =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
        passwordValidation.style.display = "block";
    } else {
        password.classList.remove("is-invalid", "custom-invalid");
        passwordValidation.style.display = "none";
    }
    });

    togglePassword.addEventListener("click", function () {
    const type =
        password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        this.classList.toggle("fa-eye-slash");
        this.classList.toggle("fa-eye");
    });

signInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailValid = !email.classList.contains("is-invalid");
    const passwordValid = !password.classList.contains("is-invalid");

    if (emailValid && passwordValid) {
        signInForm.reset();
    } else {
            toast.show();
        }
});

    signInForm.addEventListener("reset", function () {
    email.classList.remove("is-invalid", "custom-invalid");
    password.classList.remove("is-invalid", "custom-invalid");
});

});


