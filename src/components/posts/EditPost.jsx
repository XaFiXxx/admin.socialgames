import React, { useState, useEffect, useRef } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function EditPost({ post, onClose }) {
  const [formData, setFormData] = useState({
    content: post.content,
    user_id: post.user_id,
    group_id: post.group_id,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.image_path ? `${process.env.REACT_APP_API_URL}/${post.image_path}` : null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(post.video_path ? `${process.env.REACT_APP_API_URL}/${post.video_path}` : null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      const token = localStorage.getItem('token');
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          api.get('/api/dashboard/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/api/groups', { // Assurez-vous que cette route existe
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersResponse.data.map(user => ({ value: user.id, label: user.username })));
        setGroups(groupsResponse.data.map(group => ({ value: group.id, label: group.name })));
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs et des groupes:', error);
        toast.error('Erreur lors de la récupération des utilisateurs et des groupes.');
      }
    };

    fetchUsersAndGroups();

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
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVideo(null);
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'group_id' || value !== null) {
        formDataToSubmit.append(key, value);
      }
    });

    if (image) {
      formDataToSubmit.append('image', image);
    }

    if (video) {
      formDataToSubmit.append('video', video);
    }

    try {
      await api.post(`/api/dashboard/posts/${post.id}/update`, formDataToSubmit, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post mis à jour avec succès!');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
      toast.error('Erreur lors de la mise à jour du post.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-3/4 max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Modifier le post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Contenu</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Utilisateur</label>
            <Select
              name="user_id"
              value={users.find(user => user.value === formData.user_id)}
              onChange={handleSelectChange}
              options={users}
              className="w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Groupe</label>
            <Select
              name="group_id"
              value={groups.find(group => group.value === formData.group_id)}
              onChange={handleSelectChange}
              options={groups}
              isClearable
              className="w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Prévisualisation"
                className="mt-4 w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Vidéo</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded"
            />
            {videoPreview && (
              <video
                src={videoPreview}
                className="mt-4 w-full h-64 object-cover rounded-lg"
                controls
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

export default EditPost;
