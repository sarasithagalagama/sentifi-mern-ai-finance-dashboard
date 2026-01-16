import axiosInstance from './axiosConfig';

export const reportApi = {
  sendMonthlyReport: async () => {
    const { data } = await axiosInstance.post('/api/reports/send');
    return data;
  }
};
