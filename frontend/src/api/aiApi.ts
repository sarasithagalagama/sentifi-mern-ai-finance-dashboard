import axiosInstance from './axiosConfig';

export const aiApi = {
  // Chat with AI Advisor
  chat: async (query: string) => {
    const { data } = await axiosInstance.post('/api/ai/chat', { query });
    // Structure: { success: true, advice: "..." }
    return data;
  },

  // Auto-categorize transaction
  categorize: async (merchantName: string, description?: string) => {
    const { data } = await axiosInstance.post('/api/ai/categorize', { merchantName, description });
    // Structure: { success: true, category: "Food & Dining" }
    return data;
  },

  // Upload receipt
  uploadReceipt: async (file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    
    // Note: If we had client-side OCR, we'd append 'ocrData' here too
    const { data } = await axiosInstance.post('/api/ai/scan-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
