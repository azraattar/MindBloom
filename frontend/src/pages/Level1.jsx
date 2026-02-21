import { useState } from "react";
import MirrorMatch from "./MirrorMatch";
import SoundSafari from "./SoundSafari";
import MemoryQuest from "./MemoryQuest";

export default function Level1({ childId, onLevelComplete }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const challenges = [
    {
      id: 1,
      name: "Mirror Match",
      component: <MirrorMatch onComplete={() => next()} />
    },
    {
      id: 2,
      name: "Sound Safari",
      component: <SoundSafari onComplete={() => next()} />
    },
    {
      id: 3,
      name: "Memory Quest",
      component: <MemoryQuest onComplete={() => next()} />
    }
  ];

  const next = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      onLevelComplete(); // 🎉 level finished
    }
  };

  return (
    <div className="level-container">
      <h1 className="level-title">🌟 Level 1</h1>
      <p className="level-subtitle">
        Challenge {currentChallenge + 1} of {challenges.length}
      </p>

      <div className="challenge-box">
        {challenges[currentChallenge].component}
      </div>
    </div>
  );
}