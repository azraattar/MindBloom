import { useState, useEffect, useRef } from "react";
import "./StoryPage.css";

export default function NeutralStory() {
  const [childName, setChildName] = useState("Hero");
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [voices, setVoices] = useState([]);

  const utteranceRef = useRef(null);

  const storyLines = [
    "Dark forces are spreading across the land.",
    "Only your courage can stop the evil.",
    "You must protect the land and its people.",
    "Are you ready to save your kingdom?"
  ];

  /* ─── Load child name ───────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name =
      params.get("name") ||
      localStorage.getItem("childName") ||
      "Hero";
    setChildName(name);
  }, []);

  /* ─── Load voices CORRECTLY ─────────────────── */
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  

  /* ─── Start Story ───────────────────────────── */
  const startStory = () => {
    setIsAnimating(true);
    setCurrentLine(0);
    readStoryAloud();
  };

  /* ─── Text-to-Speech (FIXED) ────────────────── */
  const readStoryAloud = () => {
  if (!window.speechSynthesis || voices.length === 0) return;

  window.speechSynthesis.cancel();
  let lineIndex = 0;

  const readNextLine = () => {
    if (lineIndex >= storyLines.length) return;

    // 🔑 Update text WHEN voice starts
    setCurrentLine(lineIndex);

    const utterance = new SpeechSynthesisUtterance(
      storyLines[lineIndex]
    );
    utteranceRef.current = utterance;

    // 🎧 Child-friendly voice pacing
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const preferredVoice =
      voices.find(v => v.name === "Google UK English Female") ||
      voices.find(v => v.name === "Samantha") ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      lineIndex++;
      setTimeout(readNextLine, 400); // small dramatic pause
    };

    window.speechSynthesis.speak(utterance);
  };

  readNextLine();
};
  /* ─── Reset ─────────────────────────────────── */
  const resetStory = () => {
    window.speechSynthesis.cancel();
    setIsAnimating(false);
    setCurrentLine(0);
  };

  return (
    <div className="neutral-story-container">
      {/* Background */}
      <div className="story-background"></div>

      {/* Character */}
      <div className="character-side">
        <img src="/m1.png" alt="character" className="character-img" />
      </div>

      {/* Content */}
      <div className="story-content-box">
        <div className="greeting-section">
          <h1 className="greeting-text">
            Hello, <span className="child-name">{childName}</span>! 👋
          </h1>
        </div>

        <div className="story-display">
          {!isAnimating ? (
            <div className="story-intro">
              <p className="intro-text">
                Your adventure is about to begin...
              </p>
              <button className="start-btn" onClick={startStory}>
                Start Story
              </button>
            </div>
          ) : (
            <div className="story-lines">
              {storyLines
                .slice(0, currentLine + 1)
                .map((line, index) => (
                  <p
                    key={index}
                    className={`story-line ${
                      index === currentLine ? "active-line" : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          {isAnimating && currentLine >= storyLines.length - 1 && (
            <>
              <button
                className="action-btn primary-action"
                onClick={() => (window.location.href = "/levels")}
              >
                Accept Quest ⚔️
              </button>
              <button
                className="action-btn secondary-action"
                onClick={resetStory}
              >
                Hear Again
              </button>
            </>
          )}

          {isAnimating && currentLine < storyLines.length - 1 && (
            <button
              className="action-btn skip-btn"
              onClick={() =>
                setCurrentLine(storyLines.length - 1)
              }
            >
              Skip →
            </button>
          )}
        </div>

        <button
          className="back-btn"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}