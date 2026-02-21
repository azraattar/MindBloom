export default function MemoryQuest({ onComplete }) {
  return (
    <div className="challenge">
      <h2>🃏 Memory Quest</h2>
      <p>Match the cards to win!</p>

      {/* Card grid */}

      <button onClick={onComplete}>
        Finish Level 🎉
      </button>
    </div>
  );
}