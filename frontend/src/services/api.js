// API Client Utility to interact with Spring Boot REST Endpoints

// Use VITE_API_BASE_URL environment variable in production, fallback to local proxy in development
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sharebite_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // If the backend returned a validation map or custom error JSON, extract the message
    const errorMsg = data && typeof data === 'object' 
      ? (data.message || data.error || Object.values(data).join(', ')) 
      : (data || 'Something went wrong');
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Authentication Calls
  auth: {
    login: async (username, password) => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(response);
    },
    signup: async (userData) => {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    getCurrentUser: async () => {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    }
  },

  // Food Listing Calls
  listings: {
    getAvailable: async () => {
      const response = await fetch(`${API_BASE}/api/listings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
    getDonorListings: async () => {
      const response = await fetch(`${API_BASE}/api/listings/donor`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
    getRecipientListings: async () => {
      const response = await fetch(`${API_BASE}/api/listings/recipient`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
    create: async (listingData) => {
      const response = await fetch(`${API_BASE}/api/listings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(listingData),
      });
      return handleResponse(response);
    },
    update: async (id, listingData) => {
      const response = await fetch(`${API_BASE}/api/listings/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(listingData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE}/api/listings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
    claim: async (id) => {
      const response = await fetch(`${API_BASE}/api/listings/${id}/claim`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
    verify: async (id, pickupCode) => {
      const response = await fetch(`${API_BASE}/api/listings/${id}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    }
  }
};
