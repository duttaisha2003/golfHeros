import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL|| 'http://localhost:5000',
  withCredentials: true });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ── Scores
export const scoreAPI = {
  getAll: () => API.get('/scores'),
  add: (data) => API.post('/scores', data),
  edit: (id, data) => API.put(`/scores/${id}`, data),
  delete: (id) => API.delete(`/scores/${id}`),
};

// ── Charities
export const charityAPI = {
  getAll: (params) => API.get('/charities', { params }),
  getFeatured: () => API.get('/charities/featured'),
  getById: (id) => API.get(`/charities/${id}`),
  select: (data) => API.put('/charities/select', data),
  create: (data) => API.post('/charities', data),
  update: (id, data) => API.put(`/charities/${id}`, data),
  delete: (id) => API.delete(`/charities/${id}`),
};

// ── Draws
export const drawAPI = {
  getAll: () => API.get('/draws'),
  getCurrent: () => API.get('/draws/current'),
  adminGetAll: () => API.get('/draws/admin/all'),
  create: (data) => API.post('/draws', data),
  simulate: (id) => API.post(`/draws/${id}/simulate`),
  publish: (id) => API.post(`/draws/${id}/publish`),
};

// ── Winners
export const winnerAPI = {
  myWinnings: () => API.get('/winners/my'),
  uploadProof: (drawId, winnerId, formData) => API.post(`/winners/${drawId}/${winnerId}/proof`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  adminAll: () => API.get('/winners/admin/all'),
  verify: (drawId, winnerId, data) => API.put(`/winners/admin/${drawId}/${winnerId}/verify`, data),
  markPaid: (drawId, winnerId) => API.put(`/winners/admin/${drawId}/${winnerId}/pay`),
};

// ── Admin
export const adminAPI = {
  stats: () => API.get('/admin/stats'),
  users: (params) => API.get('/admin/users', { params }),
  userById: (id) => API.get(`/admin/users/${id}`),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  updateSubscription: (id, data) => API.put(`/admin/users/${id}/subscription`, data),
  editScore: (id, data) => API.put(`/admin/users/${id}/scores`, data),
};

// ── User / Subscription
export const userAPI = {
  subscribe: (data) => API.post('/users/subscribe', data),
  subscription: () => API.get('/users/subscription'),
};

export default API;