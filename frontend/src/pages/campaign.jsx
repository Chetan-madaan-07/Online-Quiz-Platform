import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Campaign() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/campaign", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("Failed to parse campaign JSON", parseError);
          throw new Error("Server returned an invalid response");
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load campaign");
        }

        setCampaign(data);
        setError("");
      } catch (err) {
        console.error("Campaign load error:", err);
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="campaign-page">
      <div className="campaign-container">
        <div className="campaign-header">
          <div>
            <h1>Campaign Map</h1>
            <p>Progress through levels and earn stars.</p>
          </div>
          <div className="campaign-stars">
            ⭐ {campaign?.stars ?? 0} stars
          </div>
        </div>

        {loading && <p className="campaign-status">Loading campaign...</p>}
        {error && <p className="error-message">{error}</p>}

        {campaign && (
          <div className="campaign-grid">
            {campaign.levels.map((level) => (
              <button
                key={level.level}
                className={`level-card ${level.unlocked ? "unlocked" : "locked"}`}
                disabled={!level.unlocked}
                onClick={() => navigate(`/campaign/level/${level.level}`)}
              >
                <div className="level-number">Level {level.level}</div>
                <div className="level-name">{level.name}</div>
                <div className="level-requirement">
                  Requires {level.requiredStars}⭐
                </div>
                {!level.unlocked && (
                  <div className="level-locked-label">Locked</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Campaign;


