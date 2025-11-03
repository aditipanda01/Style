// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://style-bcgu.onrender.com';

console.log('🌐 API Base URL:', API_BASE_URL); // Debug log

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // User
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  
  // Designs
  DESIGNS: `${API_BASE_URL}/api/designs`,
  DESIGN_LIKE: (id) => `${API_BASE_URL}/api/designs/${id}/like`,
  DESIGN_SAVE: (id) => `${API_BASE_URL}/api/designs/${id}/save`,
  DESIGN_SHARE: (id) => `${API_BASE_URL}/api/designs/${id}/share`,
  
  // Collaborations
  COLLABORATIONS: `${API_BASE_URL}/api/collaborations`,
  COLLABORATION_RESPOND: (id) => `${API_BASE_URL}/api/collaborations/${id}/respond`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export default API_BASE_URL;