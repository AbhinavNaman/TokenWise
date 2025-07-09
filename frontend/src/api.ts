// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tokenwise-vl6y.onrender.com/api', // Update if your backend uses a different port
});

export default API;
