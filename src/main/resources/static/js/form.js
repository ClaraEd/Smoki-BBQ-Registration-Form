document.addEventListener("DOMContentLoaded", function () {
  let registerForm = document.getElementById("registerForm");
  let loginForm = document.getElementById("loginForm");
  let messageDiv = document.getElementById("message");
  let nameRef = document.getElementById("registerName");
  let usernameRef = document.getElementById("registerUsername");
  let loginUsernameRef = document.getElementById("loginUsername");
  let passwordRef = document.getElementById("registerPassword");
  let loginPasswordRef = document.getElementById("loginPassword");
  let showLoginForm = document.getElementById("showLoginForm");
  let showRegisterForm = document.getElementById("showRegisterForm");
  let chefFace = document.querySelector(".chef-face");
  let hat = document.querySelector(".hat");
  let eyes = document.querySelector(".eyes");
  let utensils = document.querySelector(".utensils");
  let smile = document.querySelector(".smile");

  let normalState = () => {
    chefFace.classList.remove("move", "angry", "happy");
    eyes.classList.remove("move");
    utensils.classList.remove("move");
    hat.classList.remove("hat-tilt");
    smile.classList.remove("big");
  };

  let moveEyesAndUtensils = () => {
    eyes.classList.add("move");
    utensils.classList.add("move");
    hat.classList.add("hat-tilt");
    smile.classList.add("big");
  };

  // Function to display messages
  let showMessage = (message, type) => {
    messageDiv.innerHTML = message;
    messageDiv.className = type; // 'success' or 'error'
    messageDiv.style.display = "block"; // Ensure it's visible
    if (type === "error") {
      chefFace.classList.add("angry");
    } else if (type === "success") {
      chefFace.classList.add("happy");
    }
  };

  // Show login form and hide register form
  showLoginForm.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    showMessage("", ""); // Clear message
    normalState(); // Reset animation state
  });

  // Show register form and hide login form
  showRegisterForm.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    showMessage("", ""); // Clear message
    normalState(); // Reset animation state
  });

  // Handle registration form submission
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let registerName = document.getElementById("registerName").value;
    let registerUsername = document.getElementById("registerUsername").value;
    let registerPassword = document.getElementById("registerPassword").value;

    if (!registerName || !registerUsername || !registerPassword) {
      showMessage("Please fill out all fields.", "error");
      return;
    }

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerName,
        username: registerUsername,
        password: registerPassword,
      }),
    });

    if (response.ok) {
      showMessage("Registration successful. Please log in.", "success");
      registerForm.style.display = "none";
      loginForm.style.display = "block";
      chefFace.classList.add("bounce"); // Add bounce animation on successful registration
    } else if (response.status === 409) {
      const errorData = await response.text();
      showMessage(errorData, "error");
    } else {
      showMessage("An error occurred. Please try again.", "error");
    }
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let loginUsername = document.getElementById("loginUsername").value;
    let loginPassword = document.getElementById("loginPassword").value;

    if (!loginUsername || !loginPassword) {
      showMessage("Please fill out both fields.", "error");
      return;
    }

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      showMessage(`Welcome, ${user.name}`, "success");
      localStorage.setItem("username", user.username); // Store the username in localStorage
      localStorage.setItem("name", user.name); // Store the name in localStorage
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000); // Redirect after 1 second
    } else {
      showMessage("Invalid username or password", "error");
    }
  });

  // When focused on input fields
  nameRef.addEventListener("focus", moveEyesAndUtensils);
  usernameRef.addEventListener("focus", moveEyesAndUtensils);
  passwordRef.addEventListener("focus", moveEyesAndUtensils);
  if (loginUsernameRef)
    loginUsernameRef.addEventListener("focus", moveEyesAndUtensils);
  if (loginPasswordRef)
    loginPasswordRef.addEventListener("focus", moveEyesAndUtensils);

  // When clicking the submit buttons
  registerForm
    .querySelector("button")
    .addEventListener("click", moveEyesAndUtensils);
  if (loginForm.querySelector("button")) {
    loginForm
      .querySelector("button")
      .addEventListener("click", moveEyesAndUtensils);
  }

  // When clicked outside input fields
  document.addEventListener("click", (e) => {
    let clickedElem = e.target;
    if (
      clickedElem !== nameRef &&
      clickedElem !== usernameRef &&
      clickedElem !== passwordRef &&
      clickedElem !== loginUsernameRef &&
      clickedElem !== loginPasswordRef &&
      clickedElem !== registerForm.querySelector("button") &&
      (!loginForm.querySelector("button") ||
        clickedElem !== loginForm.querySelector("button"))
    ) {
      normalState();
    }
  });

  // Initialize to normal state
  normalState();

  // Toggle the display of the logout button when the username is clicked
  const loginLink = document.getElementById("login-link");
  const logoutButton = document.getElementById("logout-button");

  loginLink.addEventListener("click", () => {
    if (localStorage.getItem("username")) {
      logoutButton.style.display =
        logoutButton.style.display === "none" ? "block" : "none";
    }
  });

  // Handle logout
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    window.location.href = "/index.html"; // Redirect to home page after logout
  });

  // Check if the user is logged in
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");
  if (username && name) {
    loginLink.textContent = name; // Show the name if logged in
    loginLink.href = "#"; // Disable the default link behavior
  } else {
    logoutButton.style.display = "none"; // Hide the logout button if not logged in
  }
});
