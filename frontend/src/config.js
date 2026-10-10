// Centralized environment & API configuration

// Check for common Vite environment variable names
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_SERVER_URL ||
  '';

// Normalize BASE_URL: strip trailing slashes and trailing '/api' because service endpoints already include '/api'
export const BASE_URL = rawApiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');

// Socket URL: explicit VITE_SOCKET_URL wins, then BASE_URL.
// No env configured: single-service production build talks to the same
// origin that served the page (window.location.origin); local `vite dev`
// keeps pointing at the backend dev server on :5050.
export const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL || '').trim().replace(/\/+$/, '') ||
  BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5050' : window.location.origin);
