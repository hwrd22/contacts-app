import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../../authentication.js';
import './NavBar.css';

const NavBar = () => {
  const token = getToken();

  const navigateTo = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigateTo('/login');
  }

  const getUser = async () => {
    if (token) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get_user', {method: 'GET'});
        if (response.status === 200) {
          console.log(response);
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
          <img src='public/contacts.svg' />
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
        <Link onClick={handleLogout}>
          <div className='link'>Log Out</div>
        </Link>
      </div>
      }
    </nav>
   );
}
 
export default NavBar;