// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PoCreator from "./PoCreator";
import PoPreview from "./PoPreview";
import SoCreator from "./SOCreator";
import SoPreview from "./SOPreview";
import HomePage from "./home";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/pocreator" element={<PoCreator />} />
        <Route path="/popreview" element={<PoPreview />} />

        <Route path="/socreator" element={<SoCreator />} />
        <Route path="/sopreview" element={<SoPreview />} />

        <Route path="*" element={<div className="text-center mt-10 text-red-500 font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
