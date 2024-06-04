import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function UsersIndex() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/api/dashboard/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        toast.error('Erreur lors de la récupération des utilisateurs.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/users/${userId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsers(users.filter((user) => user.id !== userId));
              toast.success('Utilisateur supprimé avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression de l\'utilisateur:', error);
              toast.error('Erreur lors de la suppression de l\'utilisateur.');
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
  

  const handleAdminToggle = async (userId, isAdmin) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post(
        '/api/dashboard/user/is_admin',
        { user_id: userId, is_admin: !isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((user) => (user.id === userId ? response.data.user : user)));
      toast.success('Statut administrateur mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut administrateur:', error);
      toast.error('Erreur lors de la mise à jour du statut administrateur.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-200 font-bold text-center mb-4">Liste des utilisateurs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Avatar</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Nom d'utilisateur</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Biographie</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Anniversaire</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Location</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{user.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <img src={`${process.env.REACT_APP_API_URL}/${user.avatar_url}`} alt="Avatar" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.biography}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.birthday}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.location}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button
                      onClick={() => handleAdminToggle(user.id, user.is_admin)}
                      className={`ml-2 ${user.is_admin ? 'text-yellow-500' : 'text-blue-500'} hover:underline`}
                    >
                      {user.is_admin ? 'Révoquer Admin' : 'Rendre Admin'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-2">Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersIndex;
