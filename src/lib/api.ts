import axios from 'axios';
import * as SecureStorage from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://headache-jornal.onrender.com',
});

async function setToken() {
  const token = await SecureStorage.getItemAsync('token');
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

setToken();

export { api };
