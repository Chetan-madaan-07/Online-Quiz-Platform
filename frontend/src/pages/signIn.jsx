import { useState } from "react";
import { Link } from "react-router-dom";




function SignIn() {
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try{
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

        // ✅ success
        localStorage.setItem("token", data.token);
        navigate("/"); // home / dashboard
        }catch (error) {
            console.error("Signin error:", error);
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
