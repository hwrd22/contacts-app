import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './SignupForm.css';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

  const navigateTo = useNavigate();

  const redirectToLogin = () => {
    navigateTo('/login');
  }
  
  const verifyPassword = password => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/;
    let failedCriteria = [];

    if (!passwordRegex.test(password)) {
        if (!/(?=.*[a-z])/.test(password)) {
            failedCriteria.push("at least one lowercase letter");
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            failedCriteria.push("at least one uppercase letter");
        }
        if (!/(?=.*\d)/.test(password)) {
          failedCriteria.push("at least one digit");
      }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])/.test(password)) {
            failedCriteria.push("at least one special character");
        }
        if (password.length < 8) {
            failedCriteria.push("a minimum length of 8 characters");
        }

        return failedCriteria;
    }

    return null; // Password passed all criteria
  }

  useEffect(() => {
    if (password === confirmPassword) {
      setConfirmPasswordError('');
    } else if (confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    }
  }, [confirmPassword]);

  useEffect(() => {
    const passwordCheckFails = verifyPassword(password);
    if (passwordCheckFails && password) {
      switch (passwordCheckFails.length) {
        case 1:
          setPasswordError(`Your password must have ${passwordCheckFails[0]}`);
          break;
        case 2:
          setPasswordError(`Your password must have ${passwordCheckFails[0]} and ${passwordCheckFails[1]}`);
          break;
        default:
          setPasswordError(`Your password must have ${passwordCheckFails.slice(0, -1).join(", ") + ", and " + passwordCheckFails[passwordCheckFails.length - 1]}`);
      }
    } else {
      setPasswordError('');
    }
  }, [password]);

  const onSubmit = async evt => {
    evt.preventDefault();

    let error = false;

    let emailTaken = false;
    if (email) {
      const emailResponse = await fetch(`http://127.0.0.1:5000/api/get_user_email/${email}`);
      if (emailResponse.ok) {
        const emailJson = await emailResponse.json();
        emailTaken = emailJson.exists;
      }
    }
    let usernameTaken = false;
    if (username) {
      const usernameResponse = await fetch(`http://127.0.0.1:5000/api/get_user_username/${username}`);
      if (usernameResponse.ok) {
        const usernameJson = await usernameResponse.json();
        usernameTaken = usernameJson.exists;
      }
    }

    // Checking email and username validities
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid E-Mail address');
      error = true;
    } else if (emailTaken) {
      setEmailError('The provided E-Mail address is already in use');
      error = true;
    } else {
      setEmailError('');
    }
    if (!usernameRegex.test(username)) {
      setUsernameError('Your username must be between 3-16 characters and contain no special characters except "-" and/or "_"');
      error = true;
    } else if (usernameTaken) {
      setUsernameError('The provided username is already taken');
      error = true;
    } else {
      setUsernameError('');
    }

    // If any of the fields below are actually empty
    if (!email || !username || !password || !confirmPassword) {
      error = true;
      if (!email) {
        setEmailError('Please enter an E-Mail address');
      }
      if (!username) {
        setUsernameError('Please enter a username');
      }
      if (!password) {
        setPasswordError('Please enter a password');
      }
      if (!confirmPassword) {
        if (!password) {
          setConfirmPasswordError('Please enter a password');
        } else if (passwordError) {
          setConfirmPasswordError('Please enter a valid password');
        } else {
          setConfirmPasswordError('Please confirm your password');
        }
      }
    }

    if (error) {
      return;
    }

    const data = {
      user_id: uuidv4(),
      username,
      email,
      password
    };

    const apiURL = "http://127.0.0.1:5000/api/create_user";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(apiURL, options);

    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      console.log('Success!');
      redirectToLogin();
    }
  }

  return ( 
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit} className='signup-form'>
        <div className="form-row">
          <label>Email</label>
          <input className="user-form" type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} style={emailError ? {borderColor: 'red'} : {}}/>
          <div className='input-error' style={emailError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{emailError}</div>
        </div>
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
        <div className="form-row">
          <label>Confirm Password</label>
          <input className="user-form" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={confirmPasswordError ? {borderColor: 'red'} : {}}/>
          <div className='input-error' style={confirmPasswordError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{confirmPasswordError}</div>
        </div>
        <button>Sign Up</button>
      </form>
      <div className='alt-option'>Returning user? Please <Link to='/login'>log in</Link>.</div>
    </div>
   );
}
 
export default SignupForm;