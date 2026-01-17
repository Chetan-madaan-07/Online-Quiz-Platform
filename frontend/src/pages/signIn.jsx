import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function SignIn() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid credentials");
                return;
            }

            // ✅ SUCCESS: update storage + React state
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // 🔥 THIS LINE FIXES THE REFRESH ISSUE
            setUser(data.user);

            navigate("/");
        } catch (err) {
            console.error("Signin error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {error && <p className="error-text">{error}</p>}
                <h2>Sign In</h2>

                <form onSubmit={handleSubmit}>
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
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don’t have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
