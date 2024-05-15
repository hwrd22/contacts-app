import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onSubmit = async evt => {
    evt.preventDefault();

    // If any of the fields below are actually empty
    if (!username || !password) {
      if (!username) {
        setUsernameError('Please enter your username');
      }
      if (!password) {
        setPasswordError('Please enter your password');
      }
    }

    if (usernameError || passwordError) {
      return;
    }

    const data = {
      username,
      password
    };

    const apiURL = "http://127.0.0.1:5000/api/login";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(apiURL, options);

    if (response.status !== 200) {
      const data = await response.json();
      console.log(data);
      alert(data.message);
    } else {
      const navigateTo = useNavigate();
      navigateTo('/');
    }
  }

  return ( 
    <div className='signup-form'>
      <h1>Log In</h1>
      <form onSubmit={onSubmit}>
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
    </div>
   );
}
 
export default LoginForm;