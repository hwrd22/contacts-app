import { useEffect, useRef } from "react";

const IdleTimeout = ({ timeout, onTimeout }) => {
  const idleTimer = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      // Logs out the user after 15 minutes of idling
      idleTimer.current = setTimeout(onTimeout, timeout);
    };

    const clearTimer = () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer);
        idleTimer.current = null;
      }
    };

    const onUserActivity = () => {
      console.log('An input was detected. Resetting timer');
      resetTimer();
    };

    const onVisibilityChange = () => {
      document.visibilityState === 'visible' ? resetTimer() : clearTimer();
    };

    document.addEventListener('mousemove', onUserActivity);
    document.addEventListener('keydown', onUserActivity);
    document.addEventListener('visibilitychange', onVisibilityChange);

    resetTimer();

    return () => {
      document.removeEventListener('mousemove', onUserActivity);
      document.removeEventListener('keydown', onUserActivity);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
  }, [timeout, idleTimer, onTimeout]);


  return null;
}
 
export default IdleTimeout;