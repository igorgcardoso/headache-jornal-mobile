import axios from 'axios';
import * as SecureStorage from 'expo-secure-store';

export const api = axios.create({
  baseURL: 'https://headache-jornal.onrender.com',
});
