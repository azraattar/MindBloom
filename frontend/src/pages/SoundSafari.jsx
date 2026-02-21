export default function SoundSafari({ onComplete }) {
  return (
    <div className="challenge">
      <h2>🦁 Sound Safari</h2>
      <p>Listen carefully and choose the correct sound.</p>

      {/* Audio + options */}

      <button onClick={onComplete}>
        Next 🟢
      </button>
    </div>
  );
}