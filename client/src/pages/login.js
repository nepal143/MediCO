import "./App.css";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sending login data to backend
  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await fetch("https://medico-sfh1.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.user !== "false") {
        localStorage.setItem("token", data.user);      // ✅ Save token
        localStorage.setItem("userId", data.userId);   // ✅ Save userId
        window.location.href = "/home";                // ✅ Redirect to /home
      } else {
        alert("Invalid e-mail or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <div className="container">
        {/* registration part start here  */}
        <div className="register">
          {/* Login heading */}
          <h1 className="login">LOGIN</h1>

          {/* form starts here */}
          <form onSubmit={loginUser}>
            <input
              value={email}
              type="email"
              className="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              value={password}
              type="password"
              className="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input className="submit" type="submit" value="SIGN UP" />
          </form>
          {/* form ends here */}
        </div>
        {/* registration part ends here */}
      </div>
    </>
  );
}

export default App;
