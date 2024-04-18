import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [showUsersMenu, setShowUsersMenu] = useState(false);
    const [showProfilesMenu, setShowProfilesMenu] = useState(false);

    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between px-4 py-4">
                <div className="font-bold">
                    <Link to="/">Dashboard</Link>
                </div>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">Accueil</Link>
                    </li>
                    <li onMouseEnter={() => setShowUsersMenu(true)} onMouseLeave={() => setShowUsersMenu(false)}>
                        <button className="hover:bg-gray-700 px-3 py-2 rounded">Users</button>
                        {showUsersMenu && (
                            <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                                <Link to="/users/list" className="block px-4 py-2 hover:bg-gray-600">Liste des utilisateurs</Link>
                                <Link to="/users/add" className="block px-4 py-2 hover:bg-gray-600">Ajouter un utilisateur</Link>
                            </div>
                        )}
                    </li>
                    <li onMouseEnter={() => setShowProfilesMenu(true)} onMouseLeave={() => setShowProfilesMenu(false)}>
                        <button className="hover:bg-gray-700 px-3 py-2 rounded">Profils</button>
                        {showProfilesMenu && (
                            <div className="absolute mt-2 py-2 w-48 bg-gray-700 rounded shadow-lg z-10">
                                <Link to="/profiles/list" className="block px-4 py-2 hover:bg-gray-600">Liste des profils</Link>
                                <Link to="/profiles/edit" className="block px-4 py-2 hover:bg-gray-600">Modifier les profils</Link>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
