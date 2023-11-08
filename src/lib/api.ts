import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://headache-jornal.onrender.com',
});
