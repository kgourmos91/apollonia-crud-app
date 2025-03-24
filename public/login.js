// login.js

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear any previous error
    document.getElementById("login-error").textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    if (!username || !password) {
        document.getElementById("login-error").textContent = "Please enter both username and password.";
        return;
    }

    const encodedAuth = btoa(`${username}:${password}`);
    localStorage.setItem("apolloniaAuth", encodedAuth);

    // Test credentials by calling a protected route
    fetch("/api/employees", {
        headers: {
            "Authorization": "Basic " + encodedAuth
        }
    })
        .then(res => {
            if (res.ok) {
                document.getElementById("login-form").reset(); // Clear form on success
                window.location.href = "index.html"; // Redirect to app
            } else {
                throw new Error("Unauthorized");
            }
        })
        .catch(() => {
            document.getElementById("login-error").textContent = "Invalid credentials. Please try again.";
        });
});
