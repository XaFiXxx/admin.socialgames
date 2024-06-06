import React, { useState, useEffect, useRef } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';

function EditPlatform({ platform, onClose, onUpdate, onAdd }) {
  const [name, setName] = useState(platform.name || '');
  const modalRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (platform.id) {
        const response = await api.post(`/api/dashboard/platforms/${platform.id}/update`, { name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onUpdate(response.data);
        toast.success('Plateforme mise à jour avec succès!');
      } else {
        onAdd({ name });
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la plateforme:', error);
      toast.error('Erreur lors de la mise à jour de la plateforme.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">{platform.id ? 'Modifier la plateforme' : 'Ajouter une plateforme'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Nom</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
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

export default EditPlatform;
