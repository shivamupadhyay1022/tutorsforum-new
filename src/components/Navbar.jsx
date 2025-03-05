import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-xl font-semibold bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent cursor-pointer"
            >
              TutorFind
            </span>
          </div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <button
                className="bg-gradient-to-r p-2 rounded-xl from-peach-300 to-peach-100 text-white hover:opacity-80 transition-opacity"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
              <button
                className="bg-gradient-to-r p-2 rounded-xl from-peach-300 to-peach-100 text-white hover:opacity-90 transition-opacity"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
