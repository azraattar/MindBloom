import { Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import GameSelect from "./pages/GameSelect";
import GamePlay from "./pages/GamePlay";
import GameResult from "./pages/GameResult";

import ParentLogin from "./pages/ParentLogin";
import ParentDashboard from "./pages/ParentDashboard";
import ChildProgress from "./pages/ChildProgress";
import ParentChatbot from "./pages/ParentChatbot";

function App() {
  return (
    <Routes>
      {/* Child Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/games" element={<GameSelect />} />
      <Route path="/play" element={<GamePlay />} />
      <Route path="/result" element={<GameResult />} />

      {/* Parent Routes */}
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/child-progress" element={<ChildProgress />} />
      <Route path="/parent-chatbot" element={<ParentChatbot />} />
    </Routes>
  );
}

export default App;
