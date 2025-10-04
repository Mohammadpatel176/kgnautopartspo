// HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-100 to-teal-200 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-10 w-full max-w-md text-center border border-white/30">
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">
          Welcome to Order Management
        </h1>

        <p className="mb-6 text-white/90 text-lg">
          Create and manage Sales Orders and Purchase Orders easily.
        </p>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/socreator")}
            className="py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Create Sales Order
          </button>

          <button
            onClick={() => navigate("/pocreator")}
            className="py-3 px-6 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}
