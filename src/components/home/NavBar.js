import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // Ajustez le chemin si nécessaire

function Navbar() {
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  const [showProfilesMenu, setShowProfilesMenu] = useState(false);
  const usersMenuTimeoutRef = useRef(null);
  const profilesMenuTimeoutRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMouseEnterUsers = () => {
    clearTimeout(usersMenuTimeoutRef.current);
    setShowUsersMenu(true);
  };

  const handleMouseLeaveUsers = () => {
    usersMenuTimeoutRef.current = setTimeout(() => {
      setShowUsersMenu(false);
    }, 200);
  };

  const handleMouseEnterProfiles = () => {
    clearTimeout(profilesMenuTimeoutRef.current);
    setShowProfilesMenu(true);
  };

  const handleMouseLeaveProfiles = () => {
    profilesMenuTimeoutRef.current = setTimeout(() => {
      setShowProfilesMenu(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie!");
    navigate("/login"); // Assurez-vous que la route de connexion est correcte
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between px-4 py-4">
        <div className="font-bold">
          <Link to="/">Dashboard</Link>
        </div>
        <ul className="flex space-x-4">
          <li
            onMouseEnter={handleMouseEnterUsers}
            onMouseLeave={handleMouseLeaveUsers}
          >
            <button className="hover:bg-gray-700 px-3 py-2 rounded">
              Users
            </button>
            {showUsersMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/users/list"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Liste des utilisateurs
                </Link>
                <Link
                  to="/users/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter un utilisateur
                </Link>
              </div>
            )}
          </li>
          <li
            onMouseEnter={handleMouseEnterProfiles}
            onMouseLeave={handleMouseLeaveProfiles}
          >
            <button className="hover:bg-gray-700 px-3 py-2 rounded">
              Profils
            </button>
            {showProfilesMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/profiles/list"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Liste des profils
                </Link>
                <Link
                  to="/profiles/edit"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Modifier les profils
                </Link>
              </div>
            )}
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:bg-red-700 px-3 py-2 rounded bg-red-500"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
