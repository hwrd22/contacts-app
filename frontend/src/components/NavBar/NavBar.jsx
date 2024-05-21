import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken, isTokenExpired, getUser } from '../../authentication.js';
import './NavBar.css';
import { useEffect, useRef, useState } from 'react';
import AutoLogout from '../../AutoLogout.jsx';
import IdleTimeout from '../../IdleTimeout.jsx';
import MiniProfile from '../../MiniProfile/MiniProfile.jsx';

const NavBar = () => {
  let token = getToken();
  const [user, setUser] = useState(null);

  const ref = useRef(null);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // Click is outside the component
        setIsComponentVisible(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleComponent = () => {
    setIsComponentVisible(!isComponentVisible);
  }

  const hideComponent = () => {
    setIsComponentVisible(false);
  }

  const navigateTo = useNavigate();

  // Function to forcibly log out the user if they idle on the page.
  const timeoutUser = () => {
    if (getToken()) {
      clearToken();
      token = getToken();
      navigateTo('/login?redirect=session_expired');
    }
  };

  useEffect(() => {
    const isExpired = token && isTokenExpired(token);
    if (isExpired) {
      localStorage.removeItem('jwtToken');
      navigateTo('/login?redirect=session_expired');
    }
  });

  useEffect(() => {
    getUser(token, setUser);
  }, [token]);

  return ( 
    <nav className='navbar'>
      <Link to="/">
        <div className='home-link'>
          <img src='/contacts.svg' />
          <h2>Contacts</h2>
        </div>
      </Link>
      {!token &&
      <div className='links'>
        <Link to="/register">
          <div className='link'>Sign Up</div>
        </Link>
        <Link to="/login">
          <div className='link'>Log In</div>
        </Link>
      </div> 
      }
      {token && 
      <div className='links'>
        {user && <div onClick={toggleComponent} className='link'>{user.username}</div>}
        {isComponentVisible && <div ref={ref}><MiniProfile user={ user } callback={hideComponent} /></div>}
      </div>
      }
      <AutoLogout token={ token } callback={timeoutUser} />
      {token && <IdleTimeout timeout={900000} onTimeout={timeoutUser} />}
    </nav>
   );
}
 
export default NavBar;