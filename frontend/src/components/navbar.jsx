import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();          // clears context + storage
    setOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left" onClick={() => navigate("/")}>
        ⚡ QuizClash
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {!user ? (
          // ❌ Logged out view
          <>
            <button
              className="sign-in-btn"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>

            <button
              className="sign-in-btn primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>


          </>
        ) : (
          // ✅ Logged in view
          <div className="profile-wrapper">
            <div
              className="profile-btn"
              onClick={() => setOpen(!open)}
            >
              <img
                src="/default-avatar.png"
                alt="profile"
                className="profile-img"
              />
              <span className="arrow">▾</span>
            </div>

            {open && (
              <div className="dropdown">
                <p>{user.name || "Profile"}</p>
                <p>History</p>
                <p onClick={handleLogout} className="logout">
                  Logout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;



