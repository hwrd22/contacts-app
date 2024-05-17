import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken, isTokenExpired } from '../../authentication.js';
import './NavBar.css';
import { useEffect } from 'react';
import AutoLogout from '../../AutoLogout.jsx';
import IdleTimeout from '../../IdleTimeout.jsx';

const NavBar = () => {
  let token = getToken();

  const navigateTo = useNavigate();

  const handleLogout = () => {
    clearToken();
    token = getToken();
    navigateTo('/login?redirect=logout');
  };

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

  const getUser = async () => {
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
          console.log(userJson);
        }
      } catch (err) {
        console.error(err);
      }
    } 
  }

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
        <button onClick={getUser}>Click me to output your details in the console</button>
        <div onClick={handleLogout} className='link'>Log Out</div>
      </div>
      }
      <AutoLogout token={ token } callback={timeoutUser} />
      {token && <IdleTimeout timeout={900000} onTimeout={timeoutUser} />}
    </nav>
   );
}
 
export default NavBar;