import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/register') {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;
        setAccessToken(newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const coupleMoodboardAPI = {
  checkHealth: () => api.get('/ai/couple-moodboard/health').then(r => r.data),
  generate: async (formData: any) => {
    const response = await api({
      method: 'POST',
      url: '/ai/couple-moodboard/generate',
      data: formData,
      timeout: 300000,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  editImage: async (formData: any) => {
    const response = await api({
      method: 'POST',
      url: '/ai/couple-moodboard/edit-image',
      data: formData,
      timeout: 300000,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  downloadImage: async (data: any) => {
    const response = await api({
      method: 'POST',
      url: '/ai/couple-moodboard/download-image',
      data,
      responseType: 'arraybuffer',
    });
    return {
      success: true,
      imageData: response.data,
      contentType: response.headers['content-type'],
    };
  },
};
