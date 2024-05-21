import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, refreshToken } from './authentication'; // Assuming you have a function to check token expiration

// Utility Component to check if the user's token is still active
const AutoLogout = ({ token, callback }) => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token && isTokenExpired(token)) {
        // Log out user
        callback();
      } else if (token) {
        // User has the page open and still has a valid token
        refreshToken(token);
        token = getToken();
      }

      // Check token expiration every 30 seconds
      const intervalId = setInterval(checkTokenExpiration, 30000);

      // Cleanup function to clear the interval when component unmounts
      return () => clearInterval(intervalId);
    }
  }, [token, useNavigate]);

  // This isn't supposed to render anything and is more of a background check
  return null;
};

export default AutoLogout;