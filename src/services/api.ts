import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('stratagem_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('stratagem_token');
        localStorage.removeItem('stratagem_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite?: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  demoLogin: async () => {
    const res = await api.post('/auth/demo');
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updateProfile: async (data: {
    fullName: string;
    organization?: string;
    roleTitle?: string;
    defaultRiskAppetite: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  }) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  }
};

export const decisionsAPI = {
  getAll: async (params?: {
    domain?: string;
    urgency?: string;
    search?: string;
    bookmarked?: boolean;
  }) => {
    const res = await api.get('/decisions', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/decisions/stats');
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/decisions/${id}`);
    return res.data;
  },

  analyze: async (data: {
    title: string;
    domain: string;
    urgency: string;
    riskAppetite: string;
    stakeholders?: string;
    problemStatement: string;
    budgetConstraint: string;
    timelineConstraint: string;
    nonNegotiables: string[];
    criteria: Array<{ name: string; weight: number; description?: string }>;
    alternatives: Array<{ name: string; summary: string; estimatedCost: string; estimatedTimeline: string; knownNotes?: string }>;
  }) => {
    const res = await api.post('/decisions/analyze', data);
    return res.data;
  },

  toggleBookmark: async (id: string) => {
    const res = await api.patch(`/decisions/${id}/bookmark`);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/decisions/${id}`);
    return res.data;
  },

  runWhatIf: async (id: string, userPrompt: string) => {
    const res = await api.post(`/decisions/${id}/simulate`, { userPrompt });
    return res.data;
  }
};

export const healthAPI = {
  check: async () => {
    const res = await api.get('/health');
    return res.data;
  }
};

export default api;
