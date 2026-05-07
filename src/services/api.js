import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息
    const userId = localStorage.getItem('userId') || 1;
    config.headers['X-User-Id'] = userId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API错误:', error);
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  createAnonymousUser: () => api.post('/users/anonymous'),
  getUserById: (id) => api.get(`/users/${id}`),
};

// 路线相关API
export const routeApi = {
  createRoute: (routeData) => api.post('/routes', routeData),
  getRouteById: (id) => api.get(`/routes/${id}`),
  getAllRoutes: () => api.get('/routes'),
  getCreatorRoutes: (creatorId) => api.get(`/routes/creator/${creatorId}`),
  updateRoute: (id, routeData) => api.put(`/routes/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
};

// 知识库相关API
export const knowledgeApi = {
  uploadDocument: (formData) => api.post('/knowledge/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  getDocumentById: (id) => api.get(`/knowledge/documents/${id}`),
  getAllDocuments: () => api.get('/knowledge/documents'),
  getDocumentsByCategory: (category) => api.get(`/knowledge/documents/category/${category}`),
  deleteDocument: (id) => api.delete(`/knowledge/documents/${id}`),
};

export default api;