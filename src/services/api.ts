import axios from 'axios';

import config from '../config.json';

const api = axios.create({
  baseURL: config.CODEFORCES_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
