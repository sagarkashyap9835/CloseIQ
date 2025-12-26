import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyWardrobe from "./pages/MyWardrobe";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-wardrobe" element={<MyWardrobe />} />
      </Routes>
    </Router>
  );
}
