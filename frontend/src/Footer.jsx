import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  return ( 
    <footer>
      <div className="footer-row">
        <div className="footer-column-l">
          <Link to='/about'>About</Link>
          <span className="separator"> | </span>
          <Link to='privacy'>Privacy Policy</Link>
        </div>
        <div className="footer-column-r">Copyright &copy; {new Date().getFullYear()}. App created by <a href="https://github.com/hwrd22">hwrd22</a></div>
      </div>
    </footer>
   );
}
 
export default Footer;