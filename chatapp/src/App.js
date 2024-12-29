import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatApp from "./components/ChatApp";
import Signup from "./components/signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
