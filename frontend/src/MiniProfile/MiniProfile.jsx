import { useNavigate } from 'react-router-dom';
import { clearToken } from '../authentication';
import './MiniProfile.css';

const MiniProfile = ({ user, callback }) => {
  const navigateTo = useNavigate();

  const handleLogout = () => {
    clearToken();
    // token = getToken();
    navigateTo('/login?redirect=logout');
    callback();
  };

  const goToProfile = () => {
    navigateTo('/profile');
    callback();
  }


  return ( 
    <div className="mini-card">
    {user && 
    <>
      <div className='image-container'><img className='mini-icon' src='./src/assets/avatar.svg'/></div>
      <div className="username">{user.username}</div>
      <div className="email">{user.email}</div>
      <div><button onClick={goToProfile} className='mini-profile-button'>View Profile</button></div>
      <div><button onClick={handleLogout} className='mini-profile-button'>Log out</button></div>
    </>
    }
    </div>
    
   );
}
 
export default MiniProfile;