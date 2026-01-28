import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function HeroSection() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <section className="hero">
 
      <div className="hero-badge">
        1,240 Players Online
      </div>
      <h1 className="hero-title">
        Trivia <span>Battle</span><br />
        Royale
      </h1>
      <p className="hero-desc">
        Challenge opponents worldwide in real-time quiz battles.
        Prove your knowledge and climb the ranks.
      </p>
      <div className="hero-actions">
        <button
          className="primary-btn"
          onClick={() => navigate(user ? "/campaign" : "/signin")}
        >
          Campaign Mode
        </button>
        <button
          className="secondary-btn"
          onClick={() => navigate("/rankings")}
        >
          Global Rankings
        </button>
        <button
          className="online-btn"
          onClick={() => navigate(user ? "/online" : "/signin")}
        >
          🌐 Enter Online Mode
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
