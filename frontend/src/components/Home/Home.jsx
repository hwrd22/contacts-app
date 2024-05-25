import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '../../authentication';

const Home = ({/* token */}) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(getToken());
    getUser(token, setUser);
  }, [token]);

  return ( 
    <div className='home'>
      <h1>Contacts</h1>
      <div className='description'>A place to add or view your contacts</div>
      <div className='button-row'>
        {user ? 
        <Link to='/contacts'>
          <button className='home-button'>View Contacts</button>
        </Link> :
        <>
          <Link to='/register'><button className='home-button'>Sign up</button></Link>
          <Link to='/login'><button className='home-button'>Log in</button></Link>
        </>
        }
      </div>
    </div>
   );
}
 
export default Home;