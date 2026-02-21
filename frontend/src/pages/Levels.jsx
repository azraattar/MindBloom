import { useState } from "react";
import "../styles/GameLevelMap.css";

export default function GameLevelMap() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(0);

  // Level configuration
  const levels = [
    { id: 1, stars: 0, locked: false, type: "normal" },
    { id: 2, stars: 0, locked: true, type: "normal" },
    { id: 3, stars: 0, locked: true, type: "boss" },
    { id: 4, stars: 0, locked: true, type: "normal" },
    { id: 5, stars: 0, locked: true, type: "normal" },
    { id: 6, stars: 0, locked: true, type: "normal" },
    { id: 7, stars: 0, locked: true, type: "normal" },
    { id: 8, stars: 0, locked: true, type: "treasure" },
  ];

  const handleLevelClick = (level) => {
    if (!level.locked) {
      console.log(`Starting level ${level.id}`);
      // Navigate to game level
      window.location.href = `/Level1`;
    }
  };

  return (
    <div className="game-map-container">
      {/* Background Image */}
      <div 
        className="map-background"
        style={{ backgroundImage: "url('/level-bg.jpg')" }}
      ></div>

      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn">
          <span className="back-arrow">←</span>
        </button>

        <div className="top-stats">
          <div className="stat-box hearts-stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{hearts}</span>
            <button className="stat-add-btn">+</button>
          </div>

          <div className="stat-box gems-stat">
            <span className="stat-icon">💎</span>
            <span className="stat-value">{gems}</span>
            <button className="stat-add-btn">+</button>
          </div>
        </div>
      </div>

      {/* Level Path */}
      <div className="level-path-container">
        {/* Curvy Path SVG */}
        <svg className="path-curve" viewBox="0 0 400 1000" preserveAspectRatio="none">
          <path
            d="M 200 950 
               Q 100 850, 150 750
               Q 200 650, 250 550
               Q 300 450, 200 350
               Q 100 250, 150 150
               Q 200 50, 200 0"
            fill="none"
            stroke="white"
            strokeWidth="60"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Level Nodes */}
        <div className="level-nodes">
          {levels.map((level, index) => (
            <div
              key={level.id}
              className={`level-node level-${level.id} ${
                level.locked ? "locked" : ""
              } ${level.type === "boss" ? "boss-level" : ""} ${
                level.type === "treasure" ? "treasure-level" : ""
              }`}
              onClick={() => handleLevelClick(level)}
            >
              {/* Stars above level */}
              <div className="level-stars">
                {[1, 2, 3].map((star) => (
                  <span
                    key={star}
                    className={`star ${level.stars >= star ? "earned" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Level Circle */}
              <div className="level-circle">
                {level.locked ? (
                  <span className="lock-icon">🔒</span>
                ) : level.type === "boss" ? (
                  <span className="boss-icon">👹</span>
                ) : level.type === "treasure" ? (
                  <span className="treasure-icon">🎁</span>
                ) : (
                  <span className="level-number">{level.id}</span>
                )}
              </div>

              {/* Level indicator (current level) */}
              {level.id === currentLevel && !level.locked && (
                <div className="current-indicator">
                  <div className="indicator-avatar">🧙</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      
    </div>
  );
}