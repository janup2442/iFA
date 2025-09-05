
import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

// Auth Context
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage (simple auth persistence)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user profile here
    }
  }, []);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import GamesLayout from "./pages/GamesLayout";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Minesweeper from "./components/Minesweeper";
import UnlockMe from "./components/UnlockMe";
import WaterCapacity from "./components/WaterCapacity";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavbarWrapper />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/games" element={<GamesLayout />}>
                <Route index element={<div className="text-muted">Select a game to play.</div>} />
                <Route path="minesweepers" element={<Minesweeper/>}/>
                <Route path="unlockme" element={<UnlockMe/>}/>
                <Route path="watercapacity" element={<WaterCapacity/>}/>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

function NavbarWrapper() {
  const { isAuthenticated } = React.useContext(AuthContext);
  return <Navbar isAuthenticated={isAuthenticated} />;
}
