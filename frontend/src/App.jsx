import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';

function App() {
  return (
    <Router>
      <div className='content'>
        <Routes>
          <Route exact path="/"></Route>
          <Route exact path="/register" element={<SignupForm />} />
          <Route exact path="/login" element={<LoginForm />} />
        </Routes>
      </div>
      <NavBar />
    </Router>
  )
}

export default App
