const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export const postsAPI = {
  getPosts: (skip = 0, limit = 10) => apiCall(`/posts/?skip=${skip}&limit=${limit}`),
  getPost: (slug) => apiCall(`/posts/${slug}`),
};