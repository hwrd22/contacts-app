import React, { useEffect, useRef } from 'react';

const IdleTimeout = ({ onTimeout }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleUserActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, 15 * 60 * 1000); // 15 minutes
    };

    // Add event listeners
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    // Set the initial timeout
    handleUserActivity();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      console.log('Event listeners removed.');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default IdleTimeout;