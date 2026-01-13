import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import MyWardrobe from "./pages/MyWardrobe";
import Navbar from "./components/Navbar";
import AiSuggestions from "./pages/AiSuggestions";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-wardrobe" element={<MyWardrobe />} />
          <Route path="/ai-suggestions" element={<AiSuggestions />} />
          <Route path="/weekly-planner" element={<WeeklyPlanner />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
