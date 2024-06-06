import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EditGenre from './EditGenre';
import CreateGenre from './CreateGenre';

function GenresIndex() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/dashboard/genres', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
      toast.error('Erreur lors de la récupération des genres.');
      setLoading(false);
    }
  };

  const handleDelete = async (genreId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer ce genre ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/genres/${genreId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setGenres(genres.filter((genre) => genre.id !== genreId));
              toast.success('Genre supprimé avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression du genre:', error);
              toast.error('Erreur lors de la suppression du genre.');
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

  const handleUpdate = (updatedGenre) => {
    setGenres((prevGenres) => prevGenres.map((genre) => (genre.id === updatedGenre.id ? updatedGenre : genre)));
    setSelectedGenre(null);
  };

  const handleAdd = (newGenre) => {
    setGenres([...genres, newGenre]);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des genres...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-700 font-bold text-center mb-4">Liste des genres</h2>
      <button
        onClick={() => setIsCreating(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Ajouter un genre
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Nom</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {genres.length > 0 ? (
              genres.map((genre) => (
                <tr key={genre.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{genre.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{genre.name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(genre.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button onClick={() => setSelectedGenre(genre)} className="text-blue-500 hover:underline ml-2">Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2">Aucun genre trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedGenre && (
        <EditGenre genre={selectedGenre} onClose={() => setSelectedGenre(null)} onUpdate={handleUpdate} />
      )}
      {isCreating && (
        <CreateGenre onClose={() => setIsCreating(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}

export default GenresIndex;
