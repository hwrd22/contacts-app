// React hooks
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Authentication-related functions
import { getToken, getUser } from './authentication';

// Compnents
import NavBar from './components/NavBar/NavBar';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Contacts from './components/Contacts/Contacts';
import ContactForm from './components/ContactForm/ContactForm';
import ContactView from './components/ContactView/ContactView';
import RedirectToHome from './RedirectToHome';
import ProfileForm from './components/ProfileForm/ProfileForm';
import NotFound from './NotFound';
import Footer from './Footer';
import Privacy from './Privacy';
import About from './About';

// CSS Stylesheet
import './App.css';

function App() {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(getToken());
  });

  useEffect(() => {
    getUser(token, setUser);
  }, [token]);

  return (
    <Router>
      <div className='app'>
        <div className='content'>
          <Routes>
            <Route exact path="/" element={<Home token={ token } />} />
            <Route exact path="/register" element={!token ? <SignupForm /> : <RedirectToHome />} />
            <Route exact path="/login" element={!token ? <LoginForm tokenCallback={setToken} /> : <RedirectToHome />} />
            <Route path="/profile" element={token ? <Profile user={ user } /> : <NotFound />} />
            <Route path="/edit_profile" element={token ? <ProfileForm user={ user } tokenCallback={setToken} /> : <NotFound />} />
            <Route path="/contacts" element={token ? <Contacts /> : <NotFound />} />
            <Route path="/create_contact" element={token ? <ContactForm /> : <NotFound />} />
            <Route path="/edit_contact" element={token ? <ContactForm /> : <NotFound />} />
            <Route path="/contact" element={token ? <ContactView /> : <NotFound />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <NavBar tokenCallback={setToken} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
