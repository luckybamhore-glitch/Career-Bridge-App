// Centralized environment & API configuration

// Check for common Vite environment variable names
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_SERVER_URL ||
  '';

// Normalize BASE_URL: strip trailing slashes and trailing '/api' because service endpoints already include '/api'
export const BASE_URL = rawApiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');

// Socket URL defaults to VITE_SOCKET_URL, then BASE_URL, and falls back to local dev server
export const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || '').trim().replace(/\/+$/, '') ||
  BASE_URL ||
  'http://localhost:5050';
