// Function to load the JWT token
export const getToken = () => {
  return localStorage.getItem('jwtToken');
}

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) {
    // Token is missing
    return true;
  }

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1])); // Decoding token payload
    const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds

    // Compare expiration time with current time
    return Date.now() >= expirationTime;
  } catch (error) {
    // Handle invalid token format
    console.error('Error parsing or decoding token:', error);
    return true;
  }
};

export const refreshToken = async token => {
  if (localStorage.getItem('jwtToken')) {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await fetch('http://127.0.0.1:5000/api/refresh', options);
      if (response.status === 200) {
        const userJson = await response.json();
        localStorage.setItem('jwtToken', userJson.access_token);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const getUser = async (token, callback) => {
  if (token) {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_user', options);
      if (response.status === 200) {
        const userJson = await response.json();
        callback(userJson.user);
      }
    } catch (err) {
      console.error(err);
    }
  } 
}
