import axiosInstance from './axiosConfig';

export const dashboardApi = {
  getDashboardData: async () => {
    const { data } = await axiosInstance.get('/api/dashboard');
    return data;
  },
  createGoal: async (goalData: any) => {
    const { data } = await axiosInstance.post('/api/dashboard/goals', goalData);
    return data;
  }
};
