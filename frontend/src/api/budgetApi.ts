import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budgets';

export const budgetApi = {
  getBudgets: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token;
    
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  createBudget: async (budgetData: any) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token;

    const response = await axios.post(API_URL, budgetData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  deleteBudget: async (id: string) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;
      
      const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
  }
};
