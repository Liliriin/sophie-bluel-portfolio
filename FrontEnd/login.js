const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (login) => {
  login.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = "Identifiants incorrects";
      return;
    }

    // Stocker le token
    localStorage.setItem("token", data.token);

    // Redirection vers la page admin
    window.location.href = "index.html";

  } catch (error) {
    errorMessage.textContent = "Erreur de connexion au serveur";
  }
});
