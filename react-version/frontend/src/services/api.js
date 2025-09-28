import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// AI Services - converted from Python functions
export const aiService = {
  // Generate roadmap structure
  generateRoadmap: async (topic) => {
    try {
      const response = await api.post('/ai/generate-roadmap', { topic });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate roadmap');
    }
  },

  // Generate study notes
  generateNotes: async (topic) => {
    try {
      const response = await api.post('/ai/generate-notes', { topic });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate notes');
    }
  }
};

// Resource Services - converted from Python functions  
export const resourceService = {
  // Get YouTube video
  getYouTubeVideo: async (query) => {
    try {
      const response = await api.get(`/resources/youtube/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch YouTube video');
    }
  },

  // Get online articles
  getArticles: async (query) => {
    try {
      const response = await api.get(`/resources/articles/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch articles');
    }
  },

  // Generate and download PDF
  generatePDF: async (notes, topic) => {
    try {
      const response = await api.post('/resources/generate-pdf', 
        { notes, topic },
        { 
          responseType: 'blob', // Important for binary data
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );
      
      // Create blob URL for download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const safeTopicName = topic.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeTopicName}_JEE_notes_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate PDF');
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API server is not responding');
  }
};

export default api;
