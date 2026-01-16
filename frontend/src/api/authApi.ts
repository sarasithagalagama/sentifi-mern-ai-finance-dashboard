import axiosInstance from './axiosConfig';

export const authApi = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const { data } = await axiosInstance.post('/api/auth/register', userData);
    return data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const { data } = await axiosInstance.post('/api/auth/login', credentials);
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/api/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } = await axiosInstance.get('/api/auth/me');
    return data;
  },

  refreshToken: async () => {
    const { data } = await axiosInstance.post('/api/auth/refresh');
    return data;
  },
};
