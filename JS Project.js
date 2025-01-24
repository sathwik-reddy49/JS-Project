document.getElementById("signupButton").addEventListener("click", function () {
    // Signup modal closing
    const signupModal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
    signupModal.hide();

    alert("Registered Successfully!");

    // Login modal opening
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
});