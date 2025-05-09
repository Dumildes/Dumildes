import axios from 'axios';

let accessToken = '';

// Verifica se estamos no ambiente do navegador antes de acessar o localStorage
if (typeof window !== 'undefined') {
  accessToken = localStorage.getItem("accessToken") || '3tf1kc61h6b47EW2y9BVT4sRGWV3GQRYZIcWEOPbST7b6BjutvUZwb4suVk9bhVIDEWD';
}

const CNPApi = axios.create({
  baseURL: import.meta.env.VITE_CNP_APP_API_URL,
  // baseURL: 'http://192.168.1.166:8080/',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
});

export default CNPApi;