import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  // ✅ hook yahin hona chahiye (component ke andar, top-level)
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Signup button clicked");
    console.log("Form data:", { username, email, password });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log("Signup response from backend:", data);

      if (!res.ok) {
        return;
      }

      // ✅ success → auto-login
      localStorage.setItem("token", data.token);
      navigate("/"); // home / dashboard

    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;


