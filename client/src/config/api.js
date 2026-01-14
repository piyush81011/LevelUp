const isDevelopment = import.meta.env.MODE === 'development';

// Force localhost in development to avoid configuration issues
export const API_BASE_URL = isDevelopment ? "http://localhost:8000" : (import.meta.env.VITE_API_URL || "https://levelup-nkxz.onrender.com");
export const SOCKET_URL = isDevelopment ? "http://localhost:8000" : (import.meta.env.VITE_SOCKET_URL || "https://levelup-nkxz.onrender.com");
