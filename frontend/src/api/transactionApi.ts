import axiosInstance from './axiosConfig';

export const transactionApi = {
  getTransactions: async (params?: any) => {
    const { data } = await axiosInstance.get('/api/transactions', { params });
    return data;
  },
  createTransaction: async (transactionData: any) => {
    const { data } = await axiosInstance.post('/api/transactions', transactionData);
    return data;
  },
  updateTransaction: async (id: string, transactionData: any) => {
    const { data } = await axiosInstance.put(`/api/transactions/${id}`, transactionData);
    return data;
  },
  deleteTransaction: async (id: string) => {
    const { data } = await axiosInstance.delete(`/api/transactions/${id}`);
    return data;
  },
};
