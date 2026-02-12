document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
    });
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const termsCheckbox = document.getElementById('terms');
    let firstNameIsValid = false, secondNameIsValid = false, emailIsValid = false, passwordIsvalid = false,
        confirmPasswordIsValid = false, checkerIsValid = false, cnt = 0;



    firstName.addEventListener('input', function () {
        const firstNameValidation = document.getElementById('firstNameValidation');
        const firstNameRegex = /^[a-zA-Z\s]+$/;
        if (firstName.value.trim() === '') {
            firstName.classList.add('is-invalid');
            firstName.classList.add('custom-invalid');
            firstNameValidation.textContent = 'First name is required.';
            firstNameValidation.style.display = 'block';
            firstNameIsValid = false;
        } else if (firstName.value.trim().length < 3) {
            firstName.classList.add('is-invalid');
            firstName.classList.add('custom-invalid');
            firstNameValidation.textContent = 'First name must be at least 3 characters long.';
            firstNameValidation.style.display = 'block';
            firstNameIsValid = false;
        } else if (!firstNameRegex.test(firstName.value.trim())) {
            firstName.classList.add('is-invalid');
            firstName.classList.add('custom-invalid');
            firstNameValidation.textContent = 'First name should contain only letters and spaces.';
            firstNameValidation.style.display = 'block';

            firstNameIsValid = false;
        } else {
            firstName.classList.remove('is-invalid');
            firstName.classList.remove('custom-invalid');
            firstNameValidation.style.display = 'none';
            firstNameIsValid = true;
        }


    });

    lastName.addEventListener('input', function () {
        const lastNameValidation = document.getElementById('lastNameValidation');
        const lastNameRegex = /^[a-zA-Z\s]+$/;
        if (lastName.value.trim() === '') {
            lastName.classList.add('is-invalid');
            lastName.classList.add('custom-invalid');
            lastNameValidation.textContent = 'Last name is required.';
            lastNameValidation.style.display = 'block';
            secondNameIsValid = false;
        } else if (lastName.value.trim().length < 3) {
            lastName.classList.add('is-invalid');
            lastName.classList.add('custom-invalid');
            lastNameValidation.textContent = 'Last name must be at least 3 characters long.';
            lastNameValidation.style.display = 'block';
            secondNameIsValid = false;
        } else if (!lastNameRegex.test(lastName.value.trim())) {
            lastName.classList.add('is-invalid');
            lastName.classList.add('custom-invalid');
            lastNameValidation.textContent = 'Last name should contain only letters and spaces.';
            lastNameValidation.style.display = 'block';
            secondNameIsValid = false;
        } else {
            lastName.classList.remove('is-invalid');
            lastName.classList.remove('custom-invalid');
            lastNameValidation.style.display = 'none';
            secondNameIsValid = true;
        }
    });

    email.addEventListener('input', function () {
        const emailValidation = document.getElementById('emailValidation');
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (email.value.trim() === '') {
            email.classList.add('is-invalid');
            email.classList.add('custom-invalid');
            emailValidation.textContent = 'Email is required.';
            emailValidation.style.display = 'block';
            emailIsValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            email.classList.add('is-invalid');
            email.classList.add('custom-invalid');
            emailValidation.textContent = 'Please enter a valid email address (Example: user@example.com).';
            emailValidation.style.display = 'block';
            emailIsValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.remove('custom-invalid');
            emailValidation.style.display = 'none';
            emailIsValid = true;
        }
    });

    password.addEventListener('input', function () {
        const passwordValidation = document.getElementById('passwordValidation');
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z]).{8,}$/;
        if (password.value.trim() === '') {
            password.classList.add('is-invalid');
            password.classList.add('custom-invalid');
            passwordValidation.textContent = 'Password is required.';
            passwordValidation.style.display = 'block';
            passwordIsvalid = false;
        } else if (!passwordRegex.test(password.value.trim())) {
            password.classList.add('is-invalid');
            password.classList.add('custom-invalid');
            passwordValidation.textContent = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
            passwordValidation.style.display = 'block';
            passwordIsvalid = false;
        } else {
            password.classList.remove('is-invalid');
            password.classList.remove('custom-invalid');
            passwordValidation.style.display = 'none';
            passwordIsvalid = true;
        }
    });

    confirmPassword.addEventListener('input', function () {
        const confirmPasswordValidation = document.getElementById('confirmPasswordValidation');
        if (confirmPassword.value.trim() === '') {
            confirmPassword.classList.add('is-invalid');
            confirmPassword.classList.add('custom-invalid');
            confirmPasswordValidation.textContent = 'Confirm password is required.';
            confirmPasswordValidation.style.display = 'block';
            confirmPasswordIsValid = false;
        } else if (confirmPassword.value !== password.value) {
            confirmPassword.classList.add('is-invalid');
            confirmPassword.classList.add('custom-invalid');
            confirmPasswordValidation.textContent = 'Passwords do not match.';
            confirmPasswordValidation.style.display = 'block';
            confirmPasswordIsValid = false;
        } else {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.remove('custom-invalid');
            confirmPasswordValidation.style.display = 'none';
            confirmPasswordIsValid = true;
        }
    });

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        if (type === 'text') {
            this.classList.remove('fa-eye');
            this.classList.remove('fa-solid');
            this.classList.add('fa-eye-slash');
            this.classList.add('fa-regular');
        } else {
            this.classList.add('fa-eye');
            this.classList.add('fa-solid');
            this.classList.remove('fa-eye-slash');
            this.classList.remove('fa-regular');
        }
    });

    toggleConfirmPassword.addEventListener('click', function () {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        if (type === 'text') {
            this.classList.remove('fa-eye');
            this.classList.remove('fa-solid');
            this.classList.add('fa-eye-slash');
            this.classList.add('fa-regular');
        } else {
            this.classList.add('fa-eye');
            this.classList.add('fa-solid');
            this.classList.remove('fa-eye-slash');
            this.classList.remove('fa-regular');
        }
    });

    termsCheckbox.addEventListener('change', function () {
        const termsValidation = document.getElementById('termsValidation');
        checkerIsValid = this.checked;
        if (!this.checked) {
            termsValidation.style.display = 'block';
        } else {
            termsValidation.style.display = 'none';
        }
    });

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (firstNameIsValid && secondNameIsValid && emailIsValid && passwordIsvalid && confirmPasswordIsValid && checkerIsValid) {
            postData(firstName.value, lastName.value, email.value, password.value);
        } else {
            const toastEl = document.querySelector('.toast');
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    });
    function searchData(email, callback) {
        let req = new XMLHttpRequest();
        req.open("GET", `http://localhost:3000/users?email=${email}`);
        req.send();

        req.addEventListener("readystatechange", function () {
            if (req.readyState === 4) {
                if (req.status == 200) {
                    let myData = JSON.parse(req.response);
                    callback(myData.length > 0);
                } else {
                    callback(false);
                }
            }
        });
    }

    function postData(fristName, secondName, email, password) {
        searchData(email, function (found) {
            if (found) {
                const toastE2 = document.querySelectorAll('.toast');
                const toast = new bootstrap.Toast(toastE2[1]);
                toast.show();
                return;
            }

            let newAccount = {
                "fristName": fristName,
                "lastName": secondName,
                "email": email,
                "password": password,
                "role": "user",
                "cart": []
            };
            const loggedUser = {
                email: email
            };

            let req = new XMLHttpRequest();
            req.open("POST", "http://localhost:3000/users");
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(newAccount));

            req.addEventListener("readystatechange", function () {
                if (req.readyState === 4) {
                    if (req.status == 201) {
                        // log session
                        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
                        window.location.href = 'index.html';
                    }
                }
            });
        });
    }
});


