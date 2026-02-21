export default function MirrorMatch({ onComplete }) {
  return (
    <div className="challenge">
      <h2>🪞 Mirror Match</h2>
      <p>Find the picture that looks exactly the same!</p>

      {/* Puzzle UI goes here */}

      <button onClick={onComplete}>
        I Found It! ✅
      </button>
    </div>
  );
}