import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import "../styles/rankings.css";

function Rankings() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch("http://localhost:5000/api/user/rankings", {
        headers,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRankings(data);
      } else {
        setError(data.message || "Failed to load rankings");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Rankings fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading rankings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchRankings} className="primary-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="rankings-container">
        <div className="rankings-header">
          <button onClick={() => navigate("/")} className="back-btn">
            ← Back
          </button>
          <h1>Global Rankings</h1>
          <p>Top players by stars earned</p>
        </div>

        {/* Current User Card */}
        {rankings.currentUser && (
          <div className="current-user-card">
            <h3>Your Ranking</h3>
            <div className="user-rank-item">
              <div className="rank-display">
                <span className="rank-number">#{rankings.currentUser.rank}</span>
              </div>
              <img
                src={
                  rankings.currentUser.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    rankings.currentUser.name
                  )}&background=8b5cf6&color=fff&size=40`
                }
                alt={rankings.currentUser.name}
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{rankings.currentUser.name}</span>
                <span className="user-stars">⭐ {rankings.currentUser.stars}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Rankings */}
        <div className="top-rankings">
          <h2>Top 10 Players</h2>
          <div className="rankings-list">
            {rankings.topUsers.map((user) => (
              <div key={user.id} className="rank-item">
                <div className="rank-display">
                  <span className="rank-icon">{getRankIcon(user.rank)}</span>
                </div>
                <img
                  src={
                    user.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=8b5cf6&color=fff&size=40`
                  }
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-stars">⭐ {user.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rankings;
