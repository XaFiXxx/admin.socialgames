import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import Navbar from "./components/home/NavBar";
import Home from "./components/home/Home";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate replace to="/home" />
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? <Home /> : <Navigate replace to="/login" />
            }
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
