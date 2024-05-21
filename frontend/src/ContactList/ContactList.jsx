import React from "react";
import './ContactList.css';

const ContactList = ({contacts/*, updateContact, updateCallback*/}) => {
  const onDelete = async id => {
    try {
      const options = {
        method: 'DELETE'
      }
      const response = await fetch(`http://127.0.0.1:5000/api/delete_contact/${id}`, options);
      if (response.status === 200) {
        updateCallback();
      } else {
        console.error("Failed to delete contact.");
      }
    } catch (err) {
      alert(err);
    }
  }

  return (
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
            <td>{contact.nickname ? contact.nickname : contact.firstName + ' ' + contact.lastName}</td>
            <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
            <td>
              <button onClick={() => updateContact(contact)}>Update</button>
              <button onClick={() => onDelete(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactList;