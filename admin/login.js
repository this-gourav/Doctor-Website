const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    console.log("Response:", data);

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);
      
      if (data.user.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        alert("Only admin users can access this dashboard");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
      }
    } else {
      alert(data.message || "Login Failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
});