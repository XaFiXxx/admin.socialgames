import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EditGroup from './EditGroup';
import CreateGroup from './CreateGroup';

function GroupsIndex() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      toast.error('Erreur lors de la récupération des groupes.');
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer ce groupe ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/groups/${groupId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setGroups(groups.filter((group) => group.id !== groupId));
              toast.success('Groupe supprimé avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression du groupe:', error);
              toast.error('Erreur lors de la suppression du groupe.');
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

  const handleUpdate = (updatedGroup) => {
    setGroups((prevGroups) => prevGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)));
    setSelectedGroup(null);
  };

  const handleAdd = (newGroup) => {
    setGroups([...groups, newGroup]);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des groupes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-700 font-bold text-center mb-4">Liste des groupes</h2>
      <button
        onClick={() => setIsCreating(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Ajouter un groupe
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Nom</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Description</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Jeu</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Confidentialité</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Créé par</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length > 0 ? (
              groups.map((group) => (
                <tr key={group.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{group.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <img src={`${process.env.REACT_APP_API_URL}/${group.group_image}`} alt="Group" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">{group.name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{group.description}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{group.game ? group.game.name : 'N/A'}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{group.privacy}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{group.creator ? group.creator.username : 'N/A'}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(group.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button onClick={() => setSelectedGroup(group)} className="text-blue-500 hover:underline ml-2">Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-2">Aucun groupe trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedGroup && (
        <EditGroup group={selectedGroup} onClose={() => setSelectedGroup(null)} onUpdate={handleUpdate} />
      )}
      {isCreating && (
        <CreateGroup onClose={() => setIsCreating(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}

export default GroupsIndex;
