import axios from 'axios';
const accessToken = localStorage.getItem("accessToken")

export default axios.create({
    baseURL: 'https://ofa-production-server.vamsolucoes.com/',
    // baseURL: 'http://localhost:8080/',
    headers: { Authorization: 'Bearer '.concat(accessToken ?? '3tf1kc61h6b47EW2y9BVT4sRGWV3GQRYZIcWEOPbST7b6BjutvUZwb4suVk9bhVIDEWD') }
});