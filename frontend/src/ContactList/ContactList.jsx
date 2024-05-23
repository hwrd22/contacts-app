import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../authentication";
import './ContactList.css';

const ContactList = ({contacts, updateCallback}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  
  const navigateTo = useNavigate();
  const onDelete = async () => {
    const token = getToken();
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(`http://127.0.0.1:5000/api/delete_contact/${currentContact.contact_id}`, options);
      if (response.status === 200) {
        closeModal();
        updateCallback();
      } else {
        console.error("Failed to delete contact.");
      }
    } catch (err) {
      alert(err);
    }
  }

  const goToContact = contact => {
    navigateTo(`/contact`, {state: contact});
  }

  const editContact = contact => {
    navigateTo('/edit_contact', {state: contact});
  }

  const openModal = contact => {
    document.body.style.overflow = 'hidden';
    setCurrentContact(contact);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setCurrentContact({});
    setIsModalOpen(false);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.contact_id}>
              <td>
                <div className="main-content">{contact.nickname || contact.firstName + ' ' + contact.lastName}</div>
                <div className="company-text">{contact.company}</div>
              </td>
              <td><a href={`mailto:${contact.email}`} className="main-content">{contact.email}</a></td>
              <td>
                <div className="action-button-container">
                  <button onClick={() => goToContact(contact)} className="action-button"><img src="./src/assets/view.svg" className="action-icon" /></button>
                  <div className="action-tooltip">View</div>
                </div>
                <div className="action-button-container">
                  <button onClick={() => editContact(contact)} className="action-button"><img src="./src/assets/edit.svg" className="action-icon" /></button>
                  <div className="action-tooltip">Edit</div>
                </div>
                <div className="action-button-container">
                  <button onClick={() => openModal(contact)} className="action-button"><img src="./src/assets/delete.svg" className="action-icon" /></button>
                  <div className="action-tooltip">Delete</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen &&
      <div className="modal">
        <div className="modal-box">
          <h2 className="modal-heading">Warning</h2>
          <div className="modal-content">Are you sure you want to delete this contact?</div>
          <div className="contact-to-delete">{currentContact.nickname || currentContact.firstName + ' ' + currentContact.lastName}</div>
          <div className="modal-button-row">
            <button className="cancel-button" onClick={closeModal}>Cancel</button>
            <button className="delete-button" onClick={onDelete}>Delete</button>
          </div>
        </div>
      </div>
      }
    </>
  );
}

export default ContactList;