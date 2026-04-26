import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sm_token');
      localStorage.removeItem('sm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data: object) => api.post('/auth/register', data),
  login: (data: object) => api.post('/auth/login', data),
  google: (data: object) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: object) => api.put('/auth/me', data),
};

// AI Mentor
export const aiAPI = {
  chat: (data: object) => api.post('/ai/chat', data),
  sessions: () => api.get('/ai/sessions'),
  session: (id: string) => api.get(`/ai/sessions/${id}`),
  bookmark: (id: string) => api.patch(`/ai/sessions/${id}/bookmark`),
  explain: (data: object) => api.post('/ai/explain', data),
  motivation: () => api.get('/ai/motivation'),
};

// Questions
export const questionsAPI = {
  daily: (params?: object) => api.get('/questions/daily', { params }),
  aiGenerated: (params?: object) => api.get('/questions/ai-generated', { params }),
  list: (params?: object) => api.get('/questions', { params }),
  submit: (data: object) => api.post('/questions/submit', data),
  add: (data: object) => api.post('/questions', data),
  bulkAdd: (data: object) => api.post('/questions/bulk', data),
  update: (id: string, data: object) => api.put(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
};

// NCERT
export const ncertAPI = {
  structure: () => api.get('/ncert/structure'),
  chapters: (params: object) => api.get('/ncert/chapters', { params }),
  overview: (data: object) => api.post('/ncert/overview', data),
  summary: (data: object) => api.post('/ncert/summary', data),
  flashcards: (data: object) => api.post('/ncert/flashcards', data),
  pyqs: (data: object) => api.post('/ncert/pyqs', data),
  youtubeVideos: (data: object) => api.post('/ncert/youtube-videos', data),
};

// Current Affairs
export const currentAffairsAPI = {
  today: () => api.get('/currentaffairs/today'),
  list: (params?: object) => api.get('/currentaffairs', { params }),
  quiz: (id: string) => api.get(`/currentaffairs/${id}/quiz`),
  add: (data: object) => api.post('/currentaffairs', data),
  regenerate: () => api.post('/currentaffairs/regenerate', {}),
};

// Progress
export const progressAPI = {
  today: () => api.get('/progress/today'),
  history: (days?: number) => api.get('/progress/history', { params: { days } }),
  dashboard: () => api.get('/progress/dashboard'),
  studyTime: (minutes: number) => api.post('/progress/study-time', { minutes }),
};

// Interview
export const interviewAPI = {
  start: (data?: object) => api.post('/interview/start', data),
  answer: (data: object) => api.post('/interview/answer', data),
  tips: () => api.get('/interview/tips'),
};

// Parent
export const parentAPI = {
  childProgress: (childId: string) => api.get(`/parent/child/${childId}`),
  findChild: (email: string) => api.get('/parent/find-child', { params: { email } }),
};

// Admin
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: (params?: object) => api.get('/admin/users', { params }),
  toggleUser: (id: string) => api.patch(`/admin/users/${id}/toggle`),
  leaderboard: () => api.get('/admin/leaderboard'),
};

export default api;
