// login.js - Logik för login.html

import { updateNavbar } from "./utils.js";

updateNavbar();

// Kontrollera inloggning mot users i db.json
async function login(username, password) {
  const response = await fetch("http://localhost:3001/users?username=" + username);
  const users = await response.json();

  if (users.length === 0) {
    return null;
  }

  const user = users[0];
  if (user.password === password) {
    return user;
  }
  return null;
}

// Registrera ett nytt konto
async function register(username, password) {
  // Kolla om användarnamnet redan finns
  const checkResponse = await fetch("http://localhost:3001/users?username=" + username);
  const existing = await checkResponse.json();

  if (existing.length > 0) {
    return null;
  }

  const response = await fetch("http://localhost:3001/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password, role: "student" }),
  });
  const newUser = await response.json();
  return newUser;
}

// Hämta redirect-URL från query params (om användaren skickades hit från bokning)
function getRedirectUrl() {
  if (window.location.search.includes("redirect=")) {
    return window.location.search.split("redirect=")[1];
  }
  return "index.html";
}

// Inloggningsknapp
document.getElementById("login-btn").addEventListener("click", async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("login-error");

  if (!username || !password) {
    errorMsg.textContent = "Fyll i användarnamn och lösenord.";
    errorMsg.classList.add("show");
    return;
  }

  try {
    const user = await login(username, password);
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = getRedirectUrl();
    } else {
      errorMsg.textContent = "Fel användarnamn eller lösenord.";
      errorMsg.classList.add("show");
    }
  } catch (error) {
    errorMsg.textContent = "Kunde inte ansluta. Är JSON-Server igång?";
    errorMsg.classList.add("show");
  }
});

// Registreringsknapp
document.getElementById("register-btn").addEventListener("click", async function () {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const errorMsg = document.getElementById("reg-error");
  const successMsg = document.getElementById("reg-success");

  if (!username || !password) {
    errorMsg.textContent = "Fyll i alla fält.";
    errorMsg.classList.add("show");
    successMsg.classList.remove("show");
    return;
  }

  try {
    const newUser = await register(username, password);
    if (newUser) {
      successMsg.classList.add("show");
      errorMsg.classList.remove("show");
      // Logga in automatiskt efter registrering
      setTimeout(function () {
        localStorage.setItem("loggedInUser", JSON.stringify(newUser));
        window.location.href = getRedirectUrl();
      }, 1000);
    } else {
      errorMsg.textContent = "Användarnamnet är redan taget.";
      errorMsg.classList.add("show");
    }
  } catch (error) {
    errorMsg.textContent = "Något gick fel.";
    errorMsg.classList.add("show");
  }
});
