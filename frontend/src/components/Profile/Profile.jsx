import { useEffect, useState } from "react";
import Dummy from "../../Dummy";
import { getToken, getUser } from "../../authentication";
import './Profile.css'

const Profile = ({  }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(getToken());
    getUser(token, setUser);
  }, [token]);

  const obfuscateEmail = () => {
    if (user) {
      const email = user.email;
      const emailName = email.split("@")[0];
      const domain = '@' + email.split("@")[1];
      const obfuscatedEmail = emailName[0] + ('*'.repeat(emailName.length - 2)) + emailName[emailName.length - 1];
      return obfuscatedEmail + domain;
    }
  }

  const obfuscatedEmail = obfuscateEmail();
  
  return ( 
    <>
      {!token || !user ? <Dummy /> : 
      <div>
        <div className="heading">Profile</div>
        <div className="profile-card">
          <div className="card-heading">Personal Information</div>
          <div>E-Mail Address: {obfuscatedEmail}</div>
          <div>Username: {user.username}</div>
        </div>
        <div className="profile-card">
          <div className="card-heading">Stored contacts</div>
          <div>{0} / {100}</div>
        </div>
        <div className="profile-card">
          <div className="card-heading">Current Plan</div>
          <div className="plan">Free</div>
        </div>
      </div>
      }
    </>
   );
}
 
export default Profile;