import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyWardrobe from "./pages/MyWardrobe";
import Navbar from "./components/Navbar";
import AiSuggestions from "./pages/AiSuggestions";
import WeeklyPlanner from "./pages/WeeklyPlanner";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-wardrobe" element={<MyWardrobe />} />
        <Route path="/ai-suggestions" element={<AiSuggestions />} />
        <Route path="/weekly-planner" element={<WeeklyPlanner />} />
      </Routes>
    </Router>
  );
}
