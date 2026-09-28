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
  // ---- Public shop (Supabase) ----
  getProducts: async (params = {}) => (await client.get('/sb/products', { params: { is_active: true, ...params } })).data,
  getProduct: async (id) => (await client.get(`/sb/products/${id}`)).data,
  getCategories: async () => (await client.get('/categories')).data,

  // ---- Checkout (Stripe) ----
  checkout: async (data) => (await client.post('/checkout', data)).data,
  checkoutStatus: async (sessionId) => (await client.get(`/checkout/status/${sessionId}`)).data,

  // ---- Catalog ----
  getDrawings: async (params) => (await client.get('/sb/explosion-drawings', { params })).data,

  // ---- Inquiries (Preis anfragen) ----
  createInquiry: async (data) => (await client.post('/inquiries', data)).data,
  getInquiries: async () => (await client.get('/inquiries', authHeaders())).data,
  deleteInquiry: async (id) => (await client.delete(`/inquiries/${id}`, authHeaders())).data,

  // ---- Admin auth ----
  login: async (password) => (await client.post('/admin/login', { password })).data,

  // ---- Admin: Supabase products ----
  adminGetProducts: async (params = {}) => (await client.get('/sb/products', { params })).data,
  adminGetProduct: async (id) => (await client.get(`/sb/products/${id}`)).data,
  createSbProduct: async (data) => (await client.post('/sb/products', data, authHeaders())).data,
  updateSbProduct: async (id, data) => (await client.put(`/sb/products/${id}`, data, authHeaders())).data,
  deleteSbProduct: async (id) => (await client.delete(`/sb/products/${id}`, authHeaders())).data,
  nextSku: async (params) => (await client.get('/sb/next-sku', { params, ...authHeaders() })).data,
  uploadImages: async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return (await client.post('/sb/upload', fd, { headers: { ...authHeaders().headers, 'Content-Type': 'multipart/form-data' } })).data;
  },

  // ---- Admin: orders ----
  getOrders: async () => (await client.get('/sb/orders', authHeaders())).data,
  uploadShippingLabel: async (orderId, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return (await client.post(`/sb/orders/${orderId}/shipping-label`, fd, { headers: { ...authHeaders().headers, 'Content-Type': 'multipart/form-data' } })).data;
  },
  exportInvoicesZip: async (year, month) => {
    const res = await client.get('/sb/invoices/export', { params: { year, month }, ...authHeaders(), responseType: 'blob' });
    return res.data;
  },
};

export default api;
