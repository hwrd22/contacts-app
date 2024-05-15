import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import SignupForm from './components/SignupForm/SignupForm';

function App() {
  return (
    <Router>
      <div className='content'>
        <Routes>
          <Route exact path="/"></Route>
          <Route exact path="/register" element={<SignupForm />} />
        </Routes>
      </div>
      <NavBar />
    </Router>
  )
}

export default App
