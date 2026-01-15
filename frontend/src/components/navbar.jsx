import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
        {!isLoggedIn ? (
          // ❌ Logged out view
          <>
            <button onClick={() => navigate("/signin")}>Sign In</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
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
                <p>Profile</p>
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


