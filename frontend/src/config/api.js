// src/config/api.js
const API_URL =
  import.meta.env.VITE_API_URL || "https://space-mgph.onrender.com";

// Helper for API requests with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

export { API_URL, fetchAPI };
