export const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? `${window.location.origin}/backend/api`
  : 'https://srionegrow.com/backend/api';

