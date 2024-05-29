import { useEffect, useState } from 'react';
import { getToken, isTokenExpired, refreshToken } from './authentication';

// Utility Component to check if the user's token is still active
const AutoLogout = ({ callback, tokenCallback }) => {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token && isTokenExpired()) {
        // Log out user
        tokenCallback(getToken());
        callback();
      } else if (token) {
        // User has the page open and still has a valid token
        refreshToken(token);
        setToken(getToken());
        tokenCallback(getToken());
      }
    }
    // Check token expiration every 30 seconds
    const intervalId = setInterval(checkTokenExpiration, 30000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [token]);

  // This isn't supposed to render anything and is more of a background check
  return null;
};

export default AutoLogout;