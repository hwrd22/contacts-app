import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken, getUser } from "../../authentication";

const ProfileForm = ({tokenCallback}) => {
  const navigateTo = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [renderPage, setRenderPage] = useState(false);

  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

  useEffect(() => {
    setToken(getToken());
    getUser(token, setUser);
  }, [token]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRenderPage(true);
    }
  }, [user]);

  const goToProfile = () => {
    navigateTo('/profile');
  };

  const redirectToLogin = () => {
    clearToken();
    tokenCallback(null);
    navigateTo('/login');
  };

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

    let usernameTaken = false;
    if (username) {
      const usernameResponse = await fetch(`http://127.0.0.1:5000/api/get_user_username/${username}`);
      if (usernameResponse.ok) {
        const usernameJson = await usernameResponse.json();
        usernameTaken = usernameJson.exists;
      }
    }

    if (username) {
      if (!usernameRegex.test(username)) {
        setUsernameError('Your username must be between 3-16 characters and contain no special characters except "-" and/or "_"');
        error = true;
      } 
      else if (username !== user.username && usernameTaken) {
        setUsernameError('The provided username is already taken');
        error = true;
      }
      else {
        setUsernameError('');
      }
    }
    else {
      setUsernameError('');
    }
    
    if (password) {
      if (!oldPassword) {
        setOldPasswordError('Please confirm your old password.');
        error = true;
      }
      else {
        const passwordData  ={
          password: oldPassword
        };

        const passwordOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(passwordData)
        };

        const passwordAPICall = "http://127.0.0.1:5000/api/check_password";

        const passwordResponse = await fetch(passwordAPICall, passwordOptions);

        if (passwordResponse.status !== 201 && passwordResponse.status !== 200) {
          const data = await passwordResponse.json();
          alert(data.message);
        } else {
          const data = await passwordResponse.json();
          if (!data.matches) {
            error = true;
            setOldPasswordError('Invalid credentials');
          } else {
            setOldPasswordError('');
            if (passwordError || confirmPasswordError || password !== confirmPassword) {
              error = true;
            }
          }
        }
      }
    }
    if (error) {
      return;
    }
    setUsernameError('');
    setOldPasswordError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password && (!username || username === user.username)) {
      navigateTo('/profile');
      return;
    }

    const data = {
      username,
      password
    }

    const options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const apiURL = 'http://127.0.0.1:5000/api/update_user';

    const response = await fetch(apiURL, options);

    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      console.log('Success!');
      redirectToLogin();
    }
  };

  return ( 
    <>
      {!renderPage ? <div>Loading... Please wait.</div> : 
      <div>
        <div className="heading">Edit Profile</div>
        <div className="profile-flexbox">
          <div className="mini-container">
            <div className="mini-profile-card">
              <div className='image-container'><img className='mini-icon' src='./src/assets/avatar.svg'/></div>
              <div className="mini-username">{user.username}</div>
            </div>
            <div className="profile-options-container">
              <div className="options">
                <div className="profile-option" onClick={goToProfile}><img src="./src/assets/profile.svg" className="option-icon"/> Profile</div>
                <div className="profile-option selected"><img src="./src/assets/edit.svg" className="option-icon"/> Edit Profile</div>
              </div>
            </div>
          </div>
          <div className="detailed-container">
            <div className="profile-card">
              <div className="card-heading">Profile Details</div>
              <form onSubmit={onSubmit}>
                <div className="form-row">
                  <label>Username</label>
                  <input className="user-form" type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} style={usernameError ? {borderColor: 'red'} : {}}/>
                  <div className='input-error' style={usernameError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{usernameError}</div>
                </div>
                <div className="form-row">
                  <label>Old Password</label>
                  <input className="user-form" type="password" id="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} style={oldPasswordError ? {borderColor: 'red'} : {}}/>
                  <div className='input-error' style={oldPasswordError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{oldPasswordError}</div>
                </div>
                <div className="form-row">
                  <label>New Password</label>
                  <input className="user-form" type="password" id="new-password" value={password} onChange={e => setPassword(e.target.value)} style={passwordError ? {borderColor: 'red'} : {}}/>
                  <div className='input-error' style={passwordError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{passwordError}</div>
                </div>
                <div className="form-row">
                  <label>Confirm Password</label>
                  <input className="user-form" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={confirmPasswordError ? {borderColor: 'red'} : {}}/>
                  <div className='input-error' style={confirmPasswordError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{confirmPasswordError}</div>
                </div>
                <button>Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      }
    </>
   );
}
 
export default ProfileForm;