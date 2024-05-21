import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactForm.css';
import { getToken, getUser } from '../authentication';

const ContactForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [company, setCompany] = useState('');
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Z].[a-z]*$/;

  const navigateTo = useNavigate();

  useEffect(() => {
    getUser(token, setUser);
  }, [token]);

  const redirectToContacts = () => {
    navigateTo('/contacts');
  }

  const handlePhoneNumberChange = e => {
    if (isNaN(Number(e.target.value)) || e.target.value.length > 10 || e.target.value.includes(' ')) {
      e.preventDefault();
    } else {
      setPhoneNumber(e.target.value);
    }
  }

  const onSubmit = async evt => {
    evt.preventDefault();

    let error = false;
    let emailTaken = false;

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (email) {
      const emailResponse = await fetch(`http://127.0.0.1:5000/api/get_contact_email/${email}`, options);
      if (emailResponse.ok) {
        const emailJson = await emailResponse.json();
        emailTaken = emailJson.exists;
      }
    }

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid E-Mail address');
      error = true;
    } else if (emailTaken) {
      setEmailError('The provided E-Mail address is already in use');
      error = true;
    } else {
      setEmailError('');
    }
    
    if (phoneNumber.length > 0 && phoneNumber.length < 10) {
      setPhoneNumberError('The contact\'s phone number must be 10 digits long');
      error = true;
    } else {
      setPhoneNumberError('');
    }

    if (!nameRegex.test(firstName)) {
      setFirstNameError('The name provided is not properly capitalized');
      error = true;
    }

    if (!nameRegex.test(lastName)) {
      setLastNameError('The name provided is not properly capitalized');
      error = true;
    }

    if (!firstName || !lastName || !email) {
      error = true;
      if (!firstName) {
        setFirstNameError('Please enter the contact\'s first name');
      }
      if (!lastName) {
        setLastNameError('Please enter the contact\'s last name');
      }
      if (!email) {
        setEmailError('Please enter the contact\'s E-Mail address');
      }
    }

    if (error) {
      return;
    }

    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneNumberError('');

    const data = {
      firstName,
      lastName,
      nickname,
      phoneNumber,
      email,
      company
    };

    const apiURL = "http://127.0.0.1:5000/api/create_contact";
    const contactOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(apiURL, contactOptions);

    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      console.log('Success!');
      redirectToContacts();
    }
  }

  const navigationEntries = window.performance.getEntriesByType('navigation');

  return ( 
    <div className='signup-form'>
    {user &&
     <>
     <h1 className='form-heading'>Create a new Contact</h1>
      <form onSubmit={onSubmit}>
        <div className="name-row">
          <div className='form-row'>
            <label>First Name</label>
            <input className="user-form" type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} style={firstNameError ? {borderColor: 'red'} : {}}/>
            <div className='input-error' style={firstNameError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{firstNameError}</div>
          </div>
          <div className='form-row'>
            <label>Last Name</label>
            <input className="user-form" type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} style={lastNameError ? {borderColor: 'red'} : {}}/>
            <div className='input-error' style={lastNameError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{lastNameError}</div>
          </div>
        </div>
        <div className="form-row">
          <label>Nickname (Optional)</label>
          <input className="user-form" type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
          <div className='input-error'><img src="./src/assets/error.svg" /></div>
        </div>
        <div className="name-row">
          <div className='form-row'>
            <label>E-Mail Address</label>
            <input className="user-form" type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} style={emailError ? {borderColor: 'red'} : {}}/>
            <div className='input-error' style={emailError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{emailError}</div>
          </div>
          <div className='form-row'>
            <label>Phone Number (Optional)</label>
            <input className="user-form" type="text" id="phone" value={phoneNumber} onChange={e => handlePhoneNumberChange(e)} style={phoneNumberError ? {borderColor: 'red'} : {}}/>
            <div className='input-error' style={phoneNumberError ? {opacity: '100%'} : {}}><img src="./src/assets/error.svg" />{phoneNumberError}</div>
          </div>
        </div>
        <div className="form-row">
          <label>Company (Optional)</label>
          <input className="user-form" type="text" id="company" value={company} onChange={e => setCompany(e.target.value)}/>
        </div>
        <button>Create Contact</button>
      </form>
     </> 
    }
    </div>
   );
}
 
export default ContactForm;