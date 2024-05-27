import { useEffect, useState } from "react";
import Dummy from "../../Dummy";
import { getToken, getUser } from "../../authentication";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const Profile = ({  }) => {
  const navigateTo = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [numContacts, setNumContacts] = useState(0);
  const maxContacts = 100;  // If I were to theoretically make a paid subscription for this app, this line would be different.

  useEffect(() => {
    setToken(getToken());
    getUser(token, setUser);
    fetchContacts();
  }, [token]);

  const obfuscateEmail = () => {
    if (user) {
      const email = user.email;
      const emailName = email.split("@")[0];
      const domain = '@' + email.split("@")[1];
      const obfuscatedEmail = emailName[0] + ('*'.repeat(emailName.length - 2)) + emailName[emailName.length - 1];
      return obfuscatedEmail + domain;
    }
  };

  const fetchContacts = async () => {
    if (token) {
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://127.0.0.1:5000/api/get_contacts', options);
      const data = await response.json();
      setNumContacts(data.contacts.length);
    }
  };

  const editProfile = () => {
    navigateTo('/edit_profile', {state: user});
  }

  const obfuscatedEmail = obfuscateEmail();
  
  return ( 
    <>
      {!token || !user ? <Dummy /> : 
      <div>
        <div className="heading">Profile</div>
        <div className="profile-flexbox">
          <div className="mini-container">
            <div className="mini-profile-card">
              <div className='image-container'><img className='mini-icon' src='./src/assets/avatar.svg'/></div>
              <div className="mini-username">{user.username}</div>
            </div>
            <div className="profile-options-container">
              <div className="options">
                <div className="profile-option selected"><img src="./src/assets/profile.svg" className="option-icon"/> Profile</div>
                <div className="profile-option" onClick={editProfile}><img src="./src/assets/edit.svg" className="option-icon"/> Edit Profile</div>
              </div>
            </div>
          </div>
          <div className="detailed-container">
            <div className="profile-card">
              <div className="card-heading">Personal Information</div>
              <div>E-Mail Address: {obfuscatedEmail}</div>
              <div>Username: {user.username}</div>
            </div>
            <div className="double-column">
              <div className="profile-card">
                <div className="card-heading">Stored contacts</div>
                <div>{numContacts || 0} / {maxContacts}</div>
                <button className="view-contacts" onClick={() => navigateTo('/contacts')}><img src="./src/assets/view.svg" className="edit-icon" />View</button>
              </div>
              <div className="profile-card">
                <div className="card-heading">Current Plan</div>
                <div className="plan">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </>
   );
}
 
export default Profile;