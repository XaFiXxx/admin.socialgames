import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EditPlatform from './EditPlatform';
import CreatePlatform from './CreatePlatform'; // Import the CreatePlatform component

function PlatformsIndex() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // State to handle the creation modal

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/dashboard/platforms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatforms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des plateformes:', error);
      toast.error('Erreur lors de la récupération des plateformes.');
      setLoading(false);
    }
  };

  const handleDelete = async (platformId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette plateforme ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/platforms/${platformId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setPlatforms(platforms.filter((platform) => platform.id !== platformId));
              toast.success('Plateforme supprimée avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression de la plateforme:', error);
              toast.error('Erreur lors de la suppression de la plateforme.');
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

  const handleUpdate = (updatedPlatform) => {
    setPlatforms((prevPlatforms) => prevPlatforms.map((platform) => (platform.id === updatedPlatform.id ? updatedPlatform : platform)));
    setSelectedPlatform(null);
  };

  const handleAdd = (newPlatform) => {
    setPlatforms([...platforms, newPlatform]);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des plateformes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-700 font-bold text-center mb-4">Liste des plateformes</h2>
      <button
        onClick={() => setIsCreating(true)} // Open the creation modal
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Ajouter une plateforme
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
            {platforms.length > 0 ? (
              platforms.map((platform) => (
                <tr key={platform.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{platform.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{platform.name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(platform.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button onClick={() => setSelectedPlatform(platform)} className="text-blue-500 hover:underline ml-2">Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2">Aucune plateforme trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedPlatform && (
        <EditPlatform platform={selectedPlatform} onClose={() => setSelectedPlatform(null)} onUpdate={handleUpdate} />
      )}
      {isCreating && (
        <CreatePlatform onClose={() => setIsCreating(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}

export default PlatformsIndex;
