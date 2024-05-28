import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutDialog from '../DialogBox/LogoutDialog';
import SessionExpiredDialog from '../DialogBox/SessionExpiredDialog';
import { getToken } from '../../authentication';
import './LoginForm.css';

const LoginForm = ({tokenCallback}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigateTo = useNavigate();

  const url = new URL(window.location.href);
  const redirectTerm = url.searchParams.get('redirect');

  const showLogoutDialog = redirectTerm === 'logout';
  const showExpiredDialog = redirectTerm === 'session_expired';

  const redirectToHome = () => {
    tokenCallback(getToken());
    navigateTo('/');
  }

  const onSubmit = async evt => {
    evt.preventDefault();

    let error = false;

    let uError = '';
    let pError = '';

    const userCredentials = {
      username,
      password
    };

    const apiURL = "http://127.0.0.1:5000/api/login";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    }

    const response = await fetch(apiURL, options);
    const data = await response.json();

    if (response.status !== 200) {
      error = true;
      if (response.status === 401) {
        if (!data.userExists) {
          uError = 'Username does not exist';
          pError = 'Username does not exist';
        }
        else if (!data.passwordMatching) {
          uError = 'Incorrect password';
          pError = 'Incorrect password';
        }
      }
    }
    
    if (!username || !password) {
      error = true;
      if (!username) {
        uError = 'Please enter your username';
        pError = 'Please enter your username';
      }
      if (!password) {
        pError = 'Please enter your password';
      }
    }
    
    setUsernameError(uError);
    setPasswordError(pError);

    if (error) {
      return;
    }
    
    localStorage.setItem('jwtToken', data.access_token);
    redirectToHome();
  }

  const navigationEntries = window.performance.getEntriesByType('navigation');

  return ( 
    <div>
      {showLogoutDialog && <LogoutDialog />}
      {showExpiredDialog && <SessionExpiredDialog />}
      <h1>Log In</h1>
      <form onSubmit={onSubmit} className='login-form'>
        <div className="form-row">
          <label>Username</label>
          <input className="user-form" type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} style={usernameError ? {borderColor: 'red'} : {}}/>
          <div className='input-error' style={usernameError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{usernameError}</div>
        </div>
        <div className="form-row">
          <label>Password</label>
          <input className="user-form" type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} style={passwordError ? {borderColor: 'red'} : {}}/>
          <div className='input-error' style={passwordError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{passwordError}</div>
        </div>
        <button>Log In</button>
      </form>
      <div className='alt-option'>Don't have an account? <Link to='/register'>Create one here</Link>!</div>
    </div>
   );
}
 
export default LoginForm;