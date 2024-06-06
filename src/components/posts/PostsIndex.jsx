import React, { useEffect, useState } from 'react';
import api from '../../configs/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EditPost from './EditPost';

function PostsIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchContent, setSearchContent] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchGroup, setSearchGroup] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/dashboard/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      toast.error('Erreur lors de la récupération des posts.');
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    confirmAlert({
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer ce post ?',
      buttons: [
        {
          label: 'Oui',
          onClick: async () => {
            const token = localStorage.getItem('token');
            try {
              await api.delete(`/api/dashboard/posts/${postId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setPosts(posts.filter((post) => post.id !== postId));
              toast.success('Post supprimé avec succès!');
            } catch (error) {
              console.error('Erreur lors de la suppression du post:', error);
              toast.error('Erreur lors de la suppression du post.');
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

  const handleUpdate = (updatedPost) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setSelectedPost(null);
  };

  const filteredPosts = posts.filter(post => {
    return (
      post.content.toLowerCase().includes(searchContent.toLowerCase()) &&
      (post.user ? post.user.username.toLowerCase().includes(searchUser.toLowerCase()) : false) &&
      (post.group ? post.group.name.toLowerCase().includes(searchGroup.toLowerCase()) : searchGroup === '')
    );
  });

  if (loading) {
    return <div className="text-center text-gray-300">Chargement des posts...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-700 font-bold text-center mb-4">Liste des posts</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher par contenu..."
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Rechercher par utilisateur..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Rechercher par groupe..."
          value={searchGroup}
          onChange={(e) => setSearchGroup(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Contenu</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Utilisateur</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Groupe</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Vidéo</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="py-2 px-4 border-b border-gray-700">{post.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{post.content}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {post.user ? post.user.username : 'Utilisateur inconnu'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {post.group ? post.group.name : 'Aucun groupe'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {post.image_path && (
                      <img src={`${process.env.REACT_APP_API_URL}/${post.image_path}`} alt="Post" className="w-10 h-10 rounded-full" />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {post.video_path && (
                      <video src={`${process.env.REACT_APP_API_URL}/${post.video_path}`} className="w-20 h-20" controls />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Supprimer</button>
                    <button onClick={() => setSelectedPost(post)} className="text-blue-500 hover:underline ml-2">Modifier</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-2">Aucun post trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedPost && (
        <EditPost post={selectedPost} onClose={() => setSelectedPost(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}

export default PostsIndex;
