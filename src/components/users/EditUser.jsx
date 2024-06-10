import React, { useState, useEffect, useRef } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUser({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    username: user.username,
    email: user.email,
    biography: user.biography,
    birthday: user.birthday,
    location: user.location,
  });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url ? `${process.env.REACT_APP_API_URL}/${user.avatar_url}` : null);
  const [coverPreview, setCoverPreview] = useState(user.cover_url ? `${process.env.REACT_APP_API_URL}/${user.cover_url}` : null);

  const modalRef = useRef(null);

  const europeanCountries = [
    'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 
    'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 
    'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Kosovo', 'Latvia', 'Liechtenstein', 
    'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 
    'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'
  ];

  useEffect(() => {
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCover(null);
      setCoverPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    if (avatar) {
      formDataToSubmit.append('avatar_url', avatar);
    }

    if (cover) {
      formDataToSubmit.append('cover_url', cover);
    }

    try {
      const response = await api.post(`/api/dashboard/users/${user.id}/update`, formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onUpdate(response.data.user);
      toast.success('Utilisateur mis à jour avec succès!');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Modifier l'utilisateur</h2>
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
            <label className="block text-gray-300 mb-1">Prénom</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Biographie</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Date de naissance</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Localisation</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            >
              <option value="">Sélectionnez un pays</option>
              {europeanCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Avatar</label>
            <input
              type="file"
              name="avatar_url"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Prévisualisation de l'avatar"
                className="mt-4 w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Image de couverture</label>
            <input
              type="file"
              name="cover_url"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Prévisualisation de la couverture"
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

export default EditUser;
