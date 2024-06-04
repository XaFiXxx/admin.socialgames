import React, { useState, useEffect, useRef } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditGame({ game, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: game.name,
    description: game.description,
    developer: game.developer,
    publisher: game.publisher,
    release_date: game.release_date,
    genres: game.genres.map((genre) => genre.id),
    platforms: game.platforms.map((platform) => platform.id),
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(game.cover_image ? `${process.env.REACT_APP_API_URL}/${game.cover_image}` : null);
  const [allGenres, setAllGenres] = useState([]);
  const [allPlatforms, setAllPlatforms] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchGenresAndPlatforms = async () => {
      const token = localStorage.getItem('token');
      try {
        const [genresResponse, platformsResponse] = await Promise.all([
          api.get('/api/genres', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/platforms', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setAllGenres(genresResponse.data);
        setAllPlatforms(platformsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des genres et plateformes:', error);
        toast.error('Erreur lors de la récupération des genres et plateformes.');
      }
    };

    fetchGenresAndPlatforms();
  }, []);

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

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => parseInt(option.value, 10));
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: selectedValues,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(null);
      setCoverImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formDataToSubmit.append(`${key}[]`, v));
      } else {
        formDataToSubmit.append(key, value);
      }
    });

    if (coverImage) {
      formDataToSubmit.append('cover_image', coverImage);
    }

    try {
      const response = await api.post(`/api/dashboard/games/${game.id}/update`, formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      onUpdate(response.data); // Appeler la fonction onUpdate avec les données mises à jour
      toast.success('Jeu mis à jour avec succès!');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jeu:', error);
      toast.error('Erreur lors de la mise à jour du jeu.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Modifier le jeu</h2>
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
            <label className="block text-gray-300 mb-1">Développeur</label>
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Éditeur</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Date de sortie</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Genres</label>
            <select
              multiple
              name="genres"
              value={formData.genres}
              onChange={handleMultiSelectChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            >
              {allGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Plateformes</label>
            <select
              multiple
              name="platforms"
              value={formData.platforms}
              onChange={handleMultiSelectChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            >
              {allPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>{platform.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Image de couverture</label>
            <input
              type="file"
              name="cover_image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {coverImagePreview && (
              <img
                src={coverImagePreview}
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

export default EditGame;
