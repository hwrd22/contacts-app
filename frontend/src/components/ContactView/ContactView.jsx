import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RedirectToHome from "../../RedirectToHome";
import './ContactView.css';

const ContactView = () => {
  const location = useLocation();
  const contact = location.state || {};
  const navigateTo = useNavigate();

  const [showEmail, setShowEmail] = useState(false);

  const obfuscateEmail = () => {
    if (contact.contact_id) {
      const email = contact.email;
      const emailName = email.split("@")[0];
      const domain = '@' + email.split("@")[1];
      const obfuscatedEmail = emailName[0] + ('*'.repeat(emailName.length - 2)) + emailName[emailName.length - 1];
      return obfuscatedEmail + domain;
    }
  };

  const formatPhoneNumber = () => {
    if (contact.phoneNumber) {
      const formattedNumber = `(${contact.phoneNumber.substring(0, 3)}) ${contact.phoneNumber.substring(3, 6)}-${contact.phoneNumber.substring(6)}`;
      return formattedNumber;
    }
  }

  const toggleShowEmail = () => {
    setShowEmail(!showEmail);
  };

  const editContact = () => {
    contact.prevPage = '/contact';
    navigateTo('/edit_contact', {state: contact});
  }

  return ( 
    <>
      {!contact.contact_id && <RedirectToHome />}
      <div><Link to='/contacts'><div className='back-link'><img className='back-arrow' src='./src/assets/back.svg' /> Back</div></Link></div>
      <div className="contact-container">
        <div className="contact-mini-container">
          <div className="contact-mini-card">
            <div className="contact-display-name">{contact.firstName + ' ' + contact.lastName} {contact.nickname && <><span className="nickname-bridge">AKA</span> {contact.nickname}</>}</div>
            <div className="contact-company">{contact.company}</div>
          </div>
          <button className="edit-contact-button" onClick={editContact}>
            <img src="./src/assets/edit.svg" className="edit-icon" />
            <div className="button-text">Edit</div>
          </button>
        </div>
        <div className="contact-detailed-card">
          <div className="double-column">
            <div className="column">
              <div className="label">First Name</div>
              <div>{contact.firstName}</div>
            </div>
            <div className="column">
              <div className="label">Last Name</div>
              <div>{contact.lastName}</div>
            </div>
          </div>
          <div className="column">
            <div className="label">E-Mail Address</div>
            <div>{showEmail ? contact.email : obfuscateEmail()} <span className="js-link" onClick={toggleShowEmail}>{showEmail ? 'Hide' : 'Show'}</span></div>
          </div>
          <div className="column">
            <div className="label">Phone Number</div>
            <div>{contact.phoneNumber ? formatPhoneNumber() : 'N/A'}</div>
          </div>
          <div className="column">
            <div className="label">Company</div>
            <div>{contact.company ? contact.company : 'N/A'}</div>
          </div>
        </div>
      </div>
    </>
   );
}
 
export default ContactView;