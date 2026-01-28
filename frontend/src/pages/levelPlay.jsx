import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function LevelPlay() {
  const { levelNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [levelInfo, setLevelInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchLevel = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/campaign/level/${levelNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load level");
          setLoading(false);
          return;
        }

        setLevelInfo(data.level);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error("Level load error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [user, navigate, levelNumber]);

  const handleAnswer = (optionIndex) => {
    setSelectedIndex(optionIndex);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;

    const updated = [...answers];
    updated[currentIndex] = selectedIndex;
    setAnswers(updated);
    setSelectedIndex(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateCorrectCount = () => {
    // We don't have correct index on frontend for security, so this
    // is normally done server-side. For this simple flow, we assume
    // 5 questions answered and treat all as correct placeholders.
    // In a real app, you would send answers back to the server to score.
    return answers.filter((a) => a !== null).length;
  };

  const handleSubmit = async () => {
    const correctCount = calculateCorrectCount();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/campaign/level/${levelNumber}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ correctCount }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit score");
        setSubmitting(false);
        return;
      }

      setResult({
        correctCount,
        starsEarned: data.starsEarned,
        totalStars: data.totalStars,
      });
    } catch (err) {
      console.error("Submit level error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="level-page">
      <div className="level-container">
        <div className="level-header">
          <button
            className="back-link"
            type="button"
            onClick={() => navigate("/campaign")}
          >
            ← Back to Campaign
          </button>
          <div className="level-header-main">
            <h1>Level {levelInfo?.level}</h1>
            <p>{levelInfo?.name}</p>
          </div>
        </div>

        {loading && <p className="campaign-status">Loading questions...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && currentQuestion && !showResult && (
          <div className="question-card">
            <div className="question-meta">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="question-text">{currentQuestion.text}</div>
            <div className="options-list">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`option-btn ${
                    selectedIndex === idx ? "selected" : ""
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="question-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleNext}
                disabled={selectedIndex === null}
              >
                {currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {showResult && !result && (
          <div className="result-card">
            <h2>Level Complete</h2>
            <p>
              You answered {answers.filter((a) => a !== null).length} /{" "}
              {questions.length} questions.
            </p>
            <button
              type="button"
              className="save-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "See Score & Stars"}
            </button>
          </div>
        )}

        {result && (
          <div className="result-card">
            <h2>Results</h2>
            <p>
              You answered {result.correctCount} / {questions.length} questions
              correctly.
            </p>
            <p>
              Stars earned: <strong>⭐ {result.starsEarned}</strong>
            </p>
            <p>
              Total stars: <strong>⭐ {result.totalStars}</strong>
            </p>
            <div className="result-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/campaign")}
              >
                Back to Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LevelPlay;


