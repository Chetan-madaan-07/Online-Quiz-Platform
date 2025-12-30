import { Link } from "react-router-dom";

function SignUp() {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account</h2>

                <form>
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />

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
