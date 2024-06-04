import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EditGame from './EditGame';

function GamesIndex() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/api/dashboard/games', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des jeux:', error);
        toast.error('Erreur lors de la récupération des jeux.');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDelete = async (gameId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer ce jeu ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/games/${gameId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setGames(games.filter((game) => game.id !== gameId));
              toast.success('Jeu supprimé avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression du jeu:', error);
              toast.error('Erreur lors de la suppression du jeu.');
            }
          },
        },
        {
          label: 'Non',
          onClick: () => {},
        },
      ],
    });
  };

  const handleUpdate = (updatedGame) => {
    setGames((prevGames) => prevGames.map((game) => (game.id === updatedGame.id ? updatedGame : game)));
    setSelectedGame(null);
  };

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des jeux...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-700 font-bold text-center mb-4">Liste des jeux</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Nom</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Description</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Développeur</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Éditeur</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Date de sortie</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Genres</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Plateformes</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.length > 0 ? (
              games.map((game) => (
                <tr key={game.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{game.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <img src={`${process.env.REACT_APP_API_URL}/${game.cover_image}`} alt="Cover" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">{game.name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{game.description}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{game.developer}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{game.publisher}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{game.release_date}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {game.genres.map((genre) => genre.name).join(', ')}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {game.platforms.map((platform) => platform.name).join(', ')}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(game.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button onClick={() => setSelectedGame(game)} className="text-blue-500 hover:underline ml-2">Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-2">Aucun jeu trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedGame && (
        <EditGame game={selectedGame} onClose={() => setSelectedGame(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}

export default GamesIndex;
