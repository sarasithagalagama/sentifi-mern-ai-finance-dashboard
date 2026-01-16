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

  loginWithGoogle: async (token: string, user: any) => {
    const { data } = await axiosInstance.post('/api/auth/google', { token, user });
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
  
  updateProfile: async (userData: any) => {
    const { data } = await axiosInstance.put('/api/auth/profile', userData);
    return data;
  }
};
