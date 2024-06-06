import React, { useState, useRef, useEffect } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function CreateGroup({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    game_id: null,
    privacy: 'public',
    created_by: null,
  });
  const [groupImage, setGroupImage] = useState(null);
  const [groupImagePreview, setGroupImagePreview] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchGamesAndUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const [gamesResponse, usersResponse] = await Promise.all([
          api.get('/api/games/index', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/api/dashboard/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setGames(gamesResponse.data.map(game => ({ value: game.id, label: game.name })));
        setUsers(usersResponse.data.map(user => ({ value: user.id, label: user.username })));
      } catch (error) {
        console.error('Erreur lors de la récupération des jeux et utilisateurs:', error);
        toast.error('Erreur lors de la récupération des jeux et utilisateurs.');
      }
    };

    fetchGamesAndUsers();

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [actionMeta.name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setGroupImage(null);
      setGroupImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    if (groupImage) {
      formDataToSubmit.append('group_image', groupImage);
    }

    try {
      const response = await api.post('/api/dashboard/groups/create', formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onAdd(response.data.group);
      toast.success('Groupe ajouté avec succès!');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      toast.error('Erreur lors de la création du groupe.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Ajouter un groupe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Jeu</label>
            <Select
              name="game_id"
              value={games.find(game => game.value === formData.game_id)}
              onChange={handleSelectChange}
              options={games}
              className="w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Créé par</label>
            <Select
              name="created_by"
              value={users.find(user => user.value === formData.created_by)}
              onChange={handleSelectChange}
              options={users}
              className="w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Confidentialité</label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            >
              <option value="public">Public</option>
              <option value="private">Privé</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Image de groupe</label>
            <input
              type="file"
              name="group_image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {groupImagePreview && (
              <img
                src={groupImagePreview}
                alt="Prévisualisation de groupe"
                className="mt-4 w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
