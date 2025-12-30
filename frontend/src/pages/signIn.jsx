import { Link } from "react-router-dom";


function SignIn() {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Sign In</h2>

                <form>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />

                    <button type="submit" className="primary-btn">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>

            </div>
        </div>
    );
}

export default SignIn;
