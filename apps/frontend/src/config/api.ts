import axios from 'axios';

export const API_BASE_URL = 'localhost:3333';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

export const TOKEN_EXPIRATION_TIME = 1000 * 60 * 15;
