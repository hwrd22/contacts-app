import { useEffect, useState } from "react";
import ContactList from "../ContactList/ContactList";
import { getToken, getUser } from "../authentication";
import { Link, useNavigate } from "react-router-dom";
import './Contacts.css';

const Contacts = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState({});

  const navigateTo = useNavigate();

  useEffect(() => {
    setToken(getToken());
  });

  useEffect(() => {
    getUser(token, setUser);
    fetchContacts();
  }, [token]);
  
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
      setContacts(data.contacts);
    }
    
  };

  const onUpdate = () => {
    // closeModal();
    fetchContacts();
  }

  const addContactClick = () => {
    navigateTo('/create_contact');
  }

  return ( 
    <>
      <h1 className="contacts-heading">Contacts</h1>
      {contacts.length === 0 ? 
      <div>You have no contacts. <Link to='/create_contact'>Try adding one!</Link></div> :
      <ContactList contacts={contacts} updateCallback={onUpdate} />
      }
      <div className="add-contact-container">
        <button className="add-contact" onClick={addContactClick}>
          <img src="./src/assets/add-contact.svg" className="icon" />
        </button>
        <div className="add-contact-tooltip">Add Contact</div>
      </div>
    </>
   );
}
 
export default Contacts;