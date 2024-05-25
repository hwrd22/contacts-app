import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import Dummy from './Dummy';
import Profile from './components/Profile/Profile';
import { getToken, getUser } from './authentication';
import Home from './components/Home/Home';
import Contacts from './components/Contacts/Contacts';
import ContactForm from './components/ContactForm/ContactForm';
import ContactView from './components/ContactView/ContactView';
import RedirectToHome from './RedirectToHome';

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
      <div className='content'>
        <Routes>
          <Route exact path="/" element={<Home token={ token } />} />
          <Route exact path="/register" element={!token ? <SignupForm /> : <RedirectToHome />} />
          <Route exact path="/login" element={!token ? <LoginForm tokenCallback={setToken} /> : <RedirectToHome />} />
          <Route path="/profile" element={token ? <Profile user={ user } /> : <Dummy />} />
          <Route path="/contacts" element={token ? <Contacts /> : <Dummy />} />
          <Route path="/create_contact" element={token ? <ContactForm /> : <Dummy />} />
          <Route path="/edit_contact" element={token ? <ContactForm /> : <Dummy />} />
          <Route path="/contact" element={token ? <ContactView /> : <Dummy />} />
          <Route path="*" element={<Dummy />} />
        </Routes>
      </div>
      <NavBar tokenCallback={setToken} />
    </Router>
  )
}

export default App
