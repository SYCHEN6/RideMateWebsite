import axios from 'axios';

const API_BASE_URL = 'http://localhost:13579/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 智能问答
 * @param {string} question - 用户问题
 * @param {number} userId - 用户ID（可选）
 * @param {string} sessionId - 会话ID（可选）
 * @param {number} topK - 检索的文档数量限制（可选，默认5）
 * @returns {Promise} - 包含回答的Promise
 */
export const askQuestion = (question, userId = null, sessionId = null, topK = 5) => {
  return apiClient.post('/knowledge/chat', {
    question,
    userId,
    sessionId,
    topK,
  });
};

/**
 * 上传文档
 * @param {File} file - 要上传的文件
 * @param {string} title - 文档标题
 * @param {string} category - 文档分类
 * @returns {Promise} - 包含上传结果的Promise
 */
export const uploadDocument = (file, title, category) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('category', category);

  return axios.post(`${API_BASE_URL}/knowledge/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 获取文档列表
 * @returns {Promise} - 包含文档列表的Promise
 */
export const getDocuments = () => {
  return apiClient.get('/knowledge/documents');
};

/**
 * 根据分类获取文档
 * @param {string} category - 文档分类
 * @returns {Promise} - 包含文档列表的Promise
 */
export const getDocumentsByCategory = (category) => {
  return apiClient.get(`/knowledge/documents/category/${category}`);
};

/**
 * 获取文档详情
 * @param {number} id - 文档ID
 * @returns {Promise} - 包含文档详情的Promise
 */
export const getDocumentDetail = (id) => {
  return apiClient.get(`/knowledge/documents/${id}`);
};

/**
 * 删除文档
 * @param {number} id - 文档ID
 * @returns {Promise} - 包含删除结果的Promise
 */
export const deleteDocument = (id) => {
  return apiClient.delete(`/knowledge/documents/${id}`);
};