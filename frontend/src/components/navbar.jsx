import { Link } from "react-router-dom";
function Navbar() {
    return (
        <nav className="navbar">

            <div className="nav-left">
                <Link to="/" className="brand-link">
                    <span className="logo">⚡</span>
                    <span className="brand">QuizClash</span>
                </Link>
            </div>



            <div className="nav-right">
                <span className="nav-item">Arena</span>
                <span className="nav-item">Leaderboard</span>
                <span className="nav-item">History</span>
                <Link to="/signIn">
                    <button className="sign-in-btn">Sign In</button>
                </Link>

                <Link to="/signUp">
                    <button className="sign-in-btn">Sign Up</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;

