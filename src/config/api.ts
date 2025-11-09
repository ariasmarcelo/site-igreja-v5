// config/api.ts
// Configuração centralizada das URLs da API

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// URL da API baseada no ambiente
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3001'
  : import.meta.env.VITE_API_URL || 'https://SEU_PROJETO.vercel.app';

// Endpoints da API
export const API_ENDPOINTS = {
  // Conteúdo
  getContent: (pageId: string) => `${API_BASE_URL}/api/content/${pageId}`,
  getStyles: (pageId: string) => `${API_BASE_URL}/api/styles/${pageId}`,
  
  // Salvamento
  saveJson: `${API_BASE_URL}/api/save-json`,
  saveVisualEdits: `${API_BASE_URL}/api/save-visual-edits`,
  saveStyles: `${API_BASE_URL}/api/save-styles`,
  
  // Blog
  getBlogPosts: `${API_BASE_URL}/api/blog-posts`,
  getBlogPost: (id: string) => `${API_BASE_URL}/api/blog-posts/${id}`,
  createBlogPost: `${API_BASE_URL}/api/blog-posts`,
  updateBlogPost: (id: string) => `${API_BASE_URL}/api/blog-posts/${id}`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
};

// Log da configuração em desenvolvimento
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    environment: 'development',
    baseUrl: API_BASE_URL,
  });
}

export default API_ENDPOINTS;
