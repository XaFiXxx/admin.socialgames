import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // Ajustez le chemin si nécessaire

function Navbar() {
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [showPlatformsMenu, setShowPlatformsMenu] = useState(false);
  const [showGenresMenu, setShowGenresMenu] = useState(false);
  const [showGroupsMenu, setShowGroupsMenu] = useState(false);
  const [showPostsMenu, setShowPostsMenu] = useState(false);
  const usersMenuTimeoutRef = useRef(null);
  const gamesMenuTimeoutRef = useRef(null);
  const platformsMenuTimeoutRef = useRef(null);
  const genresMenuTimeoutRef = useRef(null);
  const groupsMenuTimeoutRef = useRef(null);
  const postsMenuTimeoutRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMouseEnter = (setShowMenu, timeoutRef) => {
    clearTimeout(timeoutRef.current);
    setShowMenu(true);
  };

  const handleMouseLeave = (setShowMenu, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie!");
    navigate("/login"); // Assurez-vous que la route de connexion est correcte
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <div className="font-bold">
          <Link to="/">Dashboard - Social Games</Link>
        </div>
        <ul className="flex space-x-4 items-center">
          <li
            onMouseEnter={() =>
              handleMouseEnter(setShowUsersMenu, usersMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowUsersMenu, usersMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/users/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Users
            </Link>
            {showUsersMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
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
            onMouseEnter={() =>
              handleMouseEnter(setShowGamesMenu, gamesMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowGamesMenu, gamesMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/games/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Games
            </Link>
            {showGamesMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/games/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter un jeu
                </Link>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() =>
              handleMouseEnter(setShowPlatformsMenu, platformsMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowPlatformsMenu, platformsMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/platforms/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Platforms
            </Link>
            {showPlatformsMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/platforms/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter une plateforme
                </Link>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() =>
              handleMouseEnter(setShowGenresMenu, genresMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowGenresMenu, genresMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/genres/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Genres
            </Link>
            {showGenresMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/genres/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter un genre
                </Link>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() =>
              handleMouseEnter(setShowGroupsMenu, groupsMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowGroupsMenu, groupsMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/groups/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Groups
            </Link>
            {showGroupsMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/groups/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter un groupe
                </Link>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() =>
              handleMouseEnter(setShowPostsMenu, postsMenuTimeoutRef)
            }
            onMouseLeave={() =>
              handleMouseLeave(setShowPostsMenu, postsMenuTimeoutRef)
            }
            className="relative"
          >
            <Link
              to="/posts/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Posts
            </Link>
            {showPostsMenu && (
              <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                <Link
                  to="/posts/add"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Ajouter un post
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
