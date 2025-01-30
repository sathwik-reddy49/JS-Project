// Package imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Configuration
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
const loginModalButton = document.getElementById("loginModalButton");
const signupModalButton = document.getElementById("signupModalButton");
const playButton = document.getElementById("playNowButton");
// Profile Button and Offcanvas Elements
const profileButton = document.getElementById("profileButton");
const userNameText = document.getElementById("userName");
const userEmailText = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");

// RECHECK : Authentication state changes listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.displayName);
        
        signupModalButton.style.display = 'none';
        loginModalButton.style.display = 'none';
        
        profileButton.textContent = `${user.displayName || 'User'}`;
        profileButton.classList.remove('d-none');
        
        userNameText.textContent = `Name: ${user.displayName || 'No name available'}`;
        userEmailText.textContent = `Email: ${user.email || 'No email available'}`;
        
    } else {
        console.log("No user logged in.");
        
        signupModalButton.style.display = 'block';
        loginModalButton.style.display = 'block';
        
        profileButton.classList.add('d-none');
    }
});

// RECHECK : Sign up button event listener
document.getElementById("signupButton").addEventListener("click", async () => {
    let sNameFromModal = document.getElementById("signup-name").value.trim();
    let sEmailFromModal = document.getElementById("signup-email").value.trim();
    let sPasswordFromModal = document.getElementById("signup-password").value.trim();
    let sConfirmPasswordFromModal = document.getElementById("signup-confirm-password").value.trim();

    if (sEmailFromModal === "" || sNameFromModal === "" || sPasswordFromModal === "" || sConfirmPasswordFromModal === "") {
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
        await createUserWithEmailAndPassword(auth, sEmailFromModal, sPasswordFromModal).then((userCredential) => {
            signupModal.hide();
            const user = userCredential.user;
            updateProfile(user, {
                displayName: sNameFromModal
            }).then(() => {
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
                    loginModal.show();
                });
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
    let lEmailFromModal = document.getElementById("login-email").value.trim();
    let lPasswordFromModal = document.getElementById("login-password").value.trim();

    if (lEmailFromModal === "" || lPasswordFromModal === "") {
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
        await signInWithEmailAndPassword(auth, lEmailFromModal, lPasswordFromModal).then(() => {
            loginModal.hide();
            Swal.fire({
                title: "Login Successful!",
                text: "Welcome to Matching Cards!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            }).then(() => {
                document.getElementById("login-email").value = "";
                document.getElementById("login-password").value = "";
                // loginModal.hide();
            });
        });
    } catch (err) {
        if (err.code === "auth/user-not-found") {
            Swal.fire({
                icon: "info",
                title: "Account Not Found",
                text: "No account found with this email. Would you like to sign up?",
                confirmButtonText: "Sign Up",
                confirmButtonColor: "#4CAF50",
            }).then(() => {
                signupModal.show();
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.message || "Something went wrong! Please try again later.",
            }).then(() => {
                loginModal.show();
            });
        }
    }
});

// RECHECK : Play button event listener
playButton.addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You need to be logged in to play!",
        }).then(() => {
            loginModal.show();
        });
    } else {
        location.href = "./game.html";
    }
});

// RECHECK : Logout button event listener
logoutButton.addEventListener("click", async () => {
    try {
        await auth.signOut();
        Swal.fire({
            title: "Logged Out!",
            text: "You have been logged out successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        }).then(() => {
            profileButton.classList.add('d-none');
            signupModalButton.style.display = 'block';
            loginModalButton.style.display = 'block';

            userNameText.textContent = 'Name: No name available';
            userEmailText.textContent = 'Email: No email available';

            const offcanvasElement = document.getElementById('profileOffcanvas');
            if (offcanvasElement) {
                const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
                offcanvasInstance.hide();
            }
        });
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: err.message || "Something went wrong during logout.",
        });
    }
});