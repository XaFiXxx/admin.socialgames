import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // Ajustez le chemin si nécessaire

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
          <li>
            <Link
              to="/users/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/games/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Games
            </Link>
          </li>
          <li>
            <Link
              to="/platforms/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Platforms
            </Link>
          </li>
          <li>
            <Link
              to="/genres/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Genres
            </Link>
          </li>
          <li>
            <Link
              to="/groups/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Groups
            </Link>
          </li>
          <li>
            <Link
              to="/posts/list"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              Posts
            </Link>
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
