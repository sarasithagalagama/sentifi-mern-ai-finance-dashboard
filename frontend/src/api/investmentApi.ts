import axiosInstance from './axiosConfig';

export const investmentApi = {
  getPortfolio: async () => {
    const { data } = await axiosInstance.get('/api/investments/portfolio');
    return data;
  },
  getTransactions: async () => {
    const { data } = await axiosInstance.get('/api/investments/transactions');
    return data;
  },
  createInvestment: async (investmentData: any) => {
    const { data } = await axiosInstance.post('/api/investments/portfolio', investmentData);
    return data;
  },
  createTransaction: async (transactionData: any) => {
    const { data } = await axiosInstance.post('/api/investments/transactions', transactionData);
    return data;
  },
};
