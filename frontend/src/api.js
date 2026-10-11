import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API, withCredentials: true });

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
  getInquiries: async () => (await client.get('/inquiries')).data,
  deleteInquiry: async (id) => (await client.delete(`/inquiries/${id}`)).data,

  // ---- Kundenkonto ----
  register: async (email, password, name) => (await client.post('/auth/register', { email, password, name })).data,
  login: async (email, password) => (await client.post('/auth/login', { email, password })).data,
  googleSession: async (sessionId) => (await client.post('/auth/google/session', { session_id: sessionId })).data,
  logout: async () => (await client.post('/auth/logout')).data,
  me: async () => (await client.get('/auth/me')).data,
  forgotPassword: async (email, resetUrlBase) => (await client.post('/auth/forgot-password', { email, reset_url_base: resetUrlBase })).data,
  resetPassword: async (token, newPassword) => (await client.post('/auth/reset-password', { token, new_password: newPassword })).data,
  getMyOrders: async () => (await client.get('/account/orders')).data,

  // ---- Mitarbeiter-Login (Admin / Bearbeiter) ----
  staffLogin: async (email, password) => (await client.post('/staff-auth/login', { email, password })).data,
  staffLogout: async () => (await client.post('/staff-auth/logout')).data,
  staffMe: async () => (await client.get('/staff-auth/me')).data,
  listStaffUsers: async () => (await client.get('/staff/users')).data,
  createStaffUser: async (data) => (await client.post('/staff/users', data)).data,
  setStaffUserActive: async (userId, isActive) => (await client.patch(`/staff/users/${userId}`, { is_active: isActive })).data,
  getAdminOverview: async () => (await client.get('/admin/overview')).data,

  // ---- Admin: Supabase products ----
  adminGetProducts: async (params = {}) => (await client.get('/sb/products', { params })).data,
  adminGetProduct: async (id) => (await client.get(`/sb/products/${id}`)).data,
  createSbProduct: async (data) => (await client.post('/sb/products', data)).data,
  updateSbProduct: async (id, data) => (await client.put(`/sb/products/${id}`, data)).data,
  deleteSbProduct: async (id) => (await client.delete(`/sb/products/${id}`)).data,
  nextSku: async (params) => (await client.get('/sb/next-sku', { params })).data,
  uploadImages: async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return (await client.post('/sb/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },

  // ---- Admin: orders ----
  getOrders: async () => (await client.get('/sb/orders')).data,
  uploadShippingLabel: async (orderId, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return (await client.post(`/sb/orders/${orderId}/shipping-label`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
  exportInvoicesZip: async (year, month) => {
    const res = await client.get('/sb/invoices/export', { params: { year, month }, responseType: 'blob' });
    return res.data;
  },
};

export default api;
