// Function to load the JWT token
export const getToken = () => {
  return localStorage.getItem('jwtToken');
}

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};
