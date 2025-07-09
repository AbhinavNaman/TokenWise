// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // Update if your backend uses a different port
});

export default API;
