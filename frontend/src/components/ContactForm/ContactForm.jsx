import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken, getUser } from '../../authentication';
import './ContactForm.css';

const ContactForm = () => {
  const location = useLocation();
  const existingContact = location.state || {};
  const existingEmail = existingContact.email || null;

  const [renderPage, setRenderPage] = useState(false);

  const [firstName, setFirstName] = useState(existingContact.firstName || '');
  const [lastName, setLastName] = useState(existingContact.lastName || '');
  const [nickname, setNickname] = useState(existingContact.nickname || '');
  const [email, setEmail] = useState(existingContact.email || '');
  const [phoneNumber, setPhoneNumber] = useState(existingContact.phoneNumber || '');
  const [company, setCompany] = useState(existingContact.company || '');
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

  useEffect(() => {
    if (user) {
      setRenderPage(true);
    }
  }, [user]);

  const clearErrors = () => {
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneNumberError('');
  }

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

    clearErrors();

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (!(existingEmail == email) && email) {
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

    clearErrors();

    const data = {
      firstName,
      lastName,
      nickname,
      phoneNumber,
      email,
      company
    };

    const apiURL = "http://127.0.0.1:5000/api/" + (existingContact.contact_id ? `update_contact/${existingContact.contact_id}` : `create_contact`);
    const contactOptions = {
      method: existingContact.contact_id ? 'PATCH' : 'POST',
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
      redirectToContacts();
    }
  }

  const goBack = () => {
    !existingContact.contact_id ? navigateTo('/contacts') : navigateTo(existingContact.prevPage, {state: existingContact});
  }

  return ( 
    <div className='contact-form'>
    {!renderPage ? <div>Loading... Please wait.</div> : user &&
     <>
     <a className='go-back-link' onClick={goBack}><div className='back-link'><img className='back-arrow' src='./src/assets/back.svg' /> Back</div></a>
     <h1 className='form-heading'>{existingContact.contact_id ? 'Edit an existing' : 'Create a new'} Contact</h1>
      <form onSubmit={onSubmit} className='contact-form-form'>
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
        <button>{existingContact.contact_id ? 'Update' : 'Create'} Contact</button>
      </form>
     </> 
    }
    </div>
   );
}
 
export default ContactForm;