// Package
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAZAV3GyV2_64_8-dfTOqciZgLG98f4Efk",
    authDomain: "js-project-551d5.firebaseapp.com",
    projectId: "js-project-551d5",
    storageBucket: "js-project-551d5.firebasestorage.app",
    messagingSenderId: "238206019067",
    appId: "1:238206019067:web:cb23d8febe4e62165dd75e",
    measurementId: "G-QZ5JY8FFMS"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const signupModal = new bootstrap.Modal(document.getElementById("signupModal"));
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));

// RECHECK : Sign up button event listener
document.getElementById("signupButton").addEventListener("click", async () => {
    let sNameFromModal = document.getElementById("signup-name").value.trim();
    let sEamilFromModal = document.getElementById("signup-email").value.trim();
    let sPasswordFromModal = document.getElementById("signup-password").value.trim();
    let sConfirmPasswordFromModal = document.getElementById("signup-confirm-password").value.trim();

    if (sEamilFromModal === "" || sNameFromModal === "" || sPasswordFromModal === "" || sConfirmPasswordFromModal === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter all fields to Sign up!",
        }).then(() => {
            signupModal.show();
        });
        return;
    }

    if (sPasswordFromModal !== sConfirmPasswordFromModal) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Passwords do not match. Please try again!",
        }).then(() => {
            signupModal.show();
        });
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, sEamilFromModal, sPasswordFromModal).then(() => {
            Swal.fire({
                title: "Sign Up Successful!",
                text: "Registered successfully. Welcome to Matching Cards!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            }).then(() => {
                document.getElementById("signup-name").value = "";
                document.getElementById("signup-email").value = "";
                document.getElementById("signup-password").value = "";
                document.getElementById("signup-confirm-password").value = "";
                // location.href = "./.html";
                signupModal.hide();
                loginModal.show();
            });
        });
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.message || "Something went wrong! Please try again later.",
        }).then(() => {
            signupModal.show();
        });
    }
});

// RECHECK : Login button event listener
document.getElementById("loginButton").addEventListener("click", async () => {
    let lEamilFromModal = document.getElementById("login-email").value.trim();
    let lPasswordFromModal = document.getElementById("login-password").value.trim();

    if (lEamilFromModal === "" || lPasswordFromModal === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter all fields to Login!",
        }).then(() => {
            loginModal.show();
        });
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, lEamilFromModal, lPasswordFromModal).then(() => {
            Swal.fire({
                title: "Login Successful!",
                text: "Welcome to Matching Cards!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            }).then(() => {
                document.getElementById("login-email").value = "";
                document.getElementById("login-password").value = "";
                // location.href = "./.html";
                loginModal.hide();
            });
        });
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.message || "Something went wrong! Please try again later.",
        }).then(() => {
            loginModal.show();
        });
    }
});
