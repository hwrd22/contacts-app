import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import Dummy from './Dummy';
import Profile from './Profile/Profile';
import { getToken, getUser } from './authentication';
import Home from './Home/Home';
import Contacts from './Contacts/Contacts';
import ContactForm from './ContactForm/ContactForm';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(getToken());
  });

  useEffect(() => {
    getUser(token, setUser);
  }, [token]);

  return (
    <Router>
      <div className='content'>
        <Routes>
          <Route exact path="/" element={<Home token={ token } />} />
          <Route exact path="/register" element={<SignupForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<Profile user={ user } />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/create_contact" element={<ContactForm />} />
          <Route path="/edit_contact" element={<ContactForm />} />
          <Route path="*" element={<Dummy />} />
        </Routes>
      </div>
      <NavBar />
    </Router>
  )
}

export default App
