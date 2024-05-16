import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken, isTokenExpired } from '../../authentication.js';
import './NavBar.css';
import { useEffect } from 'react';
import AutoLogout from '../../AutoLogout.jsx';

const NavBar = () => {
  const token = getToken();

  const navigateTo = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigateTo('/login');
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isExpired = token && isTokenExpired(token);
    if (isExpired) {
      localStorage.removeItem('jwtToken');
      navigateTo('/login');
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
      <AutoLogout token={ token }/>
    </nav>
   );
}
 
export default NavBar;