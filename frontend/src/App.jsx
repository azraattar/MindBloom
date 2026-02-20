import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Child Pages
import Landing from "./pages/Landing";
import GameSelect from "./pages/GameSelect";
import GamePlay from "./pages/GamePlay";
import GameResult from "./pages/GameResult";
import Login from "./pages/Login";
import CharacterSelection from "./pages/ChooseChar";
import CharacterStory from "./pages/StoryPage";

// Parent Pages
import ParentLogin from "./pages/ParentLogin";
import ParentDashboard from "./pages/ParentDashboard";
import ChildProgress from "./pages/ChildProgress";
import ParentChatbot from "./pages/ParentChatbot";
import AddChild from "./pages/AddChild";

import Signup from "./pages/Signup";
import DyslexiaScreening from "./pages/DyslexiaScreening";

function App() {
  // ✅ State
  const [scores, setScores] = useState([]);
  const [latestScore, setLatestScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from Flask
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get-scores/c001")
      .then((res) => res.json())
      .then((data) => {
        setScores(data);

        if (data.length > 0) {
          setLatestScore(data[data.length - 1]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching scores:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Routes>
      {/* Child Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/games" element={<GameSelect />} />
      <Route path="/play" element={<GamePlay />} />
      <Route path="/results" element={<GameResult />} />

      {/* Parent Routes */}
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/add-child" element={<AddChild />} />
      <Route
        path="/parent-dashboard"
        element={
          <ParentDashboard
            scores={scores}
            latestScore={latestScore}
            loading={loading}
          />
        }
      />

      <Route
        path="/child-progress"
        element={<ChildProgress scores={scores} />}
      />

      <Route path="/parent-chatbot" element={<ParentChatbot />} />

      <Route path="/Choose-Character" element={<CharacterSelection />} />
      <Route path="/Story-Page" element={<CharacterStory />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dyslexia-screening" element={<DyslexiaScreening />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;