export const config = {
  mockApi: import.meta.env.VITE_MOCK_API === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/instrument'
};