import axios from 'axios';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Important pour les cookies
});

// Ajouter un intercepteur pour inclure le token CSRF
api.interceptors.request.use(
  async config => {
    // Obtenir le token CSRF depuis les cookies
    const xsrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken.split('=')[1]);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Ajouter un intercepteur pour vérifier les réponses 401 et afficher un message
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    if (response && response.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      
      confirmAlert({
        title: 'Session Expirée',
        message: 'Votre session a expiré. Vous allez être redirigé vers la page de connexion.',
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              window.location.href = '/login'; // Redirige immédiatement
            }
          }
        ],
        closeOnEscape: false,
        closeOnClickOutside: false
      });
    }
    return Promise.reject(error);
  }
);

export default api;
