const VITE_API_BASE_URL = "https://collage-management-system-2.onrender.com";  // Backend URL

export const fetchData = async () => {
  const response = await fetch(`${VITE_API_BASE_URL}/api/data`);
  return response.json();
};
