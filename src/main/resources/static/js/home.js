// Check if the user is logged in
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");

  if (username && name) {
    loginLink.textContent = name; // Show the name if logged in
    loginLink.href = "#"; // Disable the default link behavior
    logoutLink.style.display = "block"; // Show logout button
  } else {
    logoutLink.style.display = "none"; // Hide logout button if not logged in
  }

  logoutLink.addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    window.location.href = "/index.html"; // Redirect to home page after logout
  });
});
