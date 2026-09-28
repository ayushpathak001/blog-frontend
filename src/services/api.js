// Centralized API service. Every backend call lives here.
import axios from 'axios';

const TOKEN_KEY = 'mb_token';
const USER_KEY = 'mb_user';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)); } catch { return null; }
  },
  save(token, user, remember) {
    this.clear();
    const s = remember ? localStorage : sessionStorage;
    s.setItem(TOKEN_KEY, token);
    s.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    [localStorage, sessionStorage].forEach((s) => { s.removeItem(TOKEN_KEY); s.removeItem(USER_KEY); });
  },
};

const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 60000 });
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

http.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Render cold start: tell the UI when a request is slow
  config.__timer = setTimeout(() => emit('api:wake', true), 4000);
  return config;
});

http.interceptors.response.use(
  (res) => { clearTimeout(res.config.__timer); emit('api:wake', false); return res; },
  (err) => {
    clearTimeout(err.config?.__timer);
    emit('api:wake', false);
    // The backend also returns 401 when a non-author edits/deletes, so only
    // credential-related 401s are treated as an expired session.
    const detail = String(err.response?.data?.detail || '');
    if (err.response?.status === 401 && storage.getToken() && /credential|token|expired|not authenticated/i.test(detail)) {
      emit('api:unauthorized');
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => http.post('/registration', data).then((r) => r.data),
  login: ({ name, password }) => {
    // OAuth2PasswordRequestForm => form-urlencoded; `username` is the user's NAME
    const body = new URLSearchParams();
    body.append('username', name);
    body.append('password', password);
    return http.post('/login', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((r) => r.data);
  },
  forgotPassword: (email) => http.post('/password', { email }).then((r) => r.data),
  resetPassword: (token, password) => http.post('/password/reset', { password }, { params: { token } }).then((r) => r.data),
};

export const blogApi = {
  list: (params) => http.get('/blog', { params }).then((r) => r.data),
  get: (id) => http.get(`/blog/${id}`).then((r) => r.data),
  create: ({ title, body }) => http.post('/blog', { title, body }).then((r) => r.data),
  update: (id, { title, body }) => http.put(`/blog/${id}`, { title, body }).then((r) => r.data),
  remove: (id) => http.delete(`/blog/${id}`).then((r) => r.data),
};
