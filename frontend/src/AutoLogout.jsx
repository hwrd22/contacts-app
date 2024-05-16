import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired, refreshToken } from './authentication'; // Assuming you have a function to check token expiration

// Utility Component to check if the user's token is still active
const AutoLogout = ({ token }) => {
  const navigateTo = useNavigate();

  // Add event listener for keyboard input
  document.addEventListener('keydown', () => {
    refreshToken(token);
  });

  // Add event listener for mouse click
  document.addEventListener('click', () => {
    refreshToken(token);
  });

  // Add event listener for mouse movement
  document.addEventListener('mousemove', (event) => {
    refreshToken(token);
  });

  // Add event listener for form input
  const inputField = document.getElementById('inputField');
  inputField && inputField.addEventListener('input', (event) => {
    refreshToken(token);
  });

  // Add event listener for scroll events
  window.addEventListener('scroll', () => {
    refreshToken(token);
  });


  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token && isTokenExpired(token)) {
        // Token has expired, clear user session and redirect to login page
        localStorage.removeItem('jwtToken');
        navigateTo('/login');
      }
    };

    // Check token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [token, navigateTo]);

  return null; // AutoLogout component doesn't render anything
};

export default AutoLogout;