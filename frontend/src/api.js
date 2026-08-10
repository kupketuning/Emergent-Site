import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

const TOKEN_KEY = 'kt_admin_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => ({ headers: { 'X-Admin-Token': getToken() || '' } });

export const api = {
  getProducts: async (params = {}) => (await client.get('/products', { params })).data,
  getProduct: async (id) => (await client.get(`/products/${id}`)).data,
  getCategories: async () => (await client.get('/categories')).data,
  login: async (password) => (await client.post('/admin/login', { password })).data,
  createProduct: async (data) => (await client.post('/products', data, authHeaders())).data,
  updateProduct: async (id, data) => (await client.put(`/products/${id}`, data, authHeaders())).data,
  deleteProduct: async (id) => (await client.delete(`/products/${id}`, authHeaders())).data,
};

export default api;
