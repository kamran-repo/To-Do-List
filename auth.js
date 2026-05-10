/* =========================
   REGISTER
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const registerBtn = document.getElementById("registerBtn");

    if (registerBtn) {

        registerBtn.addEventListener("click", () => {

            const email = document
                .getElementById("registerEmail")
                .value
                .trim();

            const password = document
                .getElementById("registerPassword")
                .value
                .trim();

            if (!email || !password) {

                alert("Please fill all fields");

                return;
            }

            const user = {
                email,
                password
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            alert("Registration Successful!");

            window.location.href = "login.html";
        });
    }

    /* =========================
       LOGIN
    ========================= */

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {

        loginBtn.addEventListener("click", () => {

            const email = document
                .getElementById("loginEmail")
                .value
                .trim();

            const password = document
                .getElementById("loginPassword")
                .value
                .trim();

            const savedUser = JSON.parse(
                localStorage.getItem("user")
            );

            if (
                savedUser &&
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );

                alert("Login Successful!");

                window.location.href = "index.html";

            } else {

                alert("Invalid email or password");
            }
        });
    }
});