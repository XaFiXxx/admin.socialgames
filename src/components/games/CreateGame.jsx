import React, { useState, useEffect, useRef } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

function CreateGame({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    developer: '',
    publisher: '',
    release_date: '',
    genres: [],
    platforms: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
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
        setAllGenres(genresResponse.data.map(genre => ({ value: genre.id, label: genre.name })));
        setAllPlatforms(platformsResponse.data.map(platform => ({ value: platform.id, label: platform.name })));
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

  const handleSelectChange = (selectedOptions, actionMeta) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [actionMeta.name]: selectedOptions,
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
        value.forEach((v) => formDataToSubmit.append(`${key}[]`, v.value));
      } else {
        formDataToSubmit.append(key, value);
      }
    });

    if (coverImage) {
      formDataToSubmit.append('cover_image', coverImage);
    }

    try {
      await api.post('/api/dashboard/games/create', formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Jeu ajouté avec succès!');
      window.location.reload(); // Forcer le rafraîchissement de la page
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      toast.error('Erreur lors de la création du jeu.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Ajouter un jeu</h2>
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
            <Select
              isMulti
              name="genres"
              value={formData.genres}
              onChange={handleSelectChange}
              options={allGenres}
              className="w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Plateformes</label>
            <Select
              isMulti
              name="platforms"
              value={formData.platforms}
              onChange={handleSelectChange}
              options={allPlatforms}
              className="w-full text-black"
            />
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

export default CreateGame;
