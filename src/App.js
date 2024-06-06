import "./App.css";
import React from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import Navbar from "./components/home/NavBar";
import Home from "./components/home/Home";
import UsersIndex from "./components/users/UsersIndex";
import GamesIndex from "./components/games/GamesIndex";
import PlatformsIndex from "./components/plateforms/PlateformsIndex";
import GenresIndex from "./components/genres/GenresIndex";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

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
          <Route
            path="/users/list"
            element={
              isAuthenticated ? (
                <UsersIndex />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/games/list"
            element={
              isAuthenticated ? (
                <GamesIndex />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/platforms/list"
            element={
              isAuthenticated ? (
                <PlatformsIndex />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/genres/list"
            element={
              isAuthenticated ? (
                <GenresIndex />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
