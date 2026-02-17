import { Routes, Route } from "react-router-dom";

// Child Pages
import Landing from "./pages/Landing";
import GameSelect from "./pages/GameSelect";
import GamePlay from "./pages/GamePlay";
import GameResult from "./pages/GameResult";
import Login from "./pages/Login";
import CharacterSelection from "./pages/ChooseChar"
// Parent Pages
import ParentLogin from "./pages/ParentLogin";
import ParentDashboard from "./pages/ParentDashboard";
import ChildProgress from "./pages/ChildProgress";
import ParentChatbot from "./pages/ParentChatbot";

import CharacterStory from "./pages/StoryPage"

import Signup from "./pages/Signup";
import DyslexiaScreening from "./pages/DyslexiaScreening";


function App() {
  return (
    <Routes>
      {/* Child Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/games" element={<GameSelect />} />
      <Route path="/play" element={<GamePlay />} />
      <Route path="/results" element={<GameResult />} /> {/* updated path to plural for consistency */}

      {/* Parent Routes */}
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/child-progress" element={<ChildProgress />} />
      <Route path="/parent-chatbot" element={<ParentChatbot />} />
      <Route path="/Choose-Character" element={<CharacterSelection />} />
      <Route path="/Story-Page" element={<CharacterStory />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dyslexia-screening" element={<DyslexiaScreening />} />

      {/* Optional: catch-all 404 route */}
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