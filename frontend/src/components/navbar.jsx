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
                src={
                  user.profilePhoto ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User") +
                    "&background=8b5cf6&color=fff&size=36"
                }
                alt="profile"
                className="profile-img"
              />
              <span className="arrow">▾</span>
            </div>

            {open && (
              <div className="dropdown">
                <p onClick={() => { navigate("/profile"); setOpen(false); }}>
                  Profile
                </p>
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



