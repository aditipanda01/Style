// API Configuration
// IMPORTANT: For local testing, access frontend at http://localhost:5173
// If accessing via Vercel URL, it will use Render backend
let API_BASE_URL = import.meta.env.VITE_API_URL;

// If no explicit API URL is set, detect based on hostname
if (!API_BASE_URL && typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const origin = window.location.origin;
  
  // Check if we're running locally
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.startsWith('192.168.') || 
                  hostname.startsWith('10.') || 
                  hostname.startsWith('172.') ||
                  origin.includes('localhost') ||
                  origin.includes('127.0.0.1');
  
  API_BASE_URL = isLocal ? 'http://localhost:5000' : 'https://style-bcgu.onrender.com';
  console.log('🔧 Origin:', origin, 'Hostname:', hostname, 'Port:', port);
  console.log('🔧 Is Local:', isLocal, '→ Using:', API_BASE_URL);
} else if (!API_BASE_URL) {
  // Server-side rendering fallback
  API_BASE_URL = 'https://style-bcgu.onrender.com';
}

console.log('🌐 API Base URL:', API_BASE_URL);

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
  DESIGN_COMMENT: (id) => `${API_BASE_URL}/api/designs/${id}/comment`,
  
  // Collaborations
  COLLABORATIONS: `${API_BASE_URL}/api/collaborations`,
  COLLABORATION_RESPOND: (id) => `${API_BASE_URL}/api/collaborations/${id}/respond`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export default API_BASE_URL;