import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return ( 
    <div className="privacy-policy">
      <h1>About</h1>
      <p>This website allows you to create and maintain a list of contacts.</p>
      <h2>Access to Our Services</h2>
      <p>In order to use our services, you will need to create an account or log into an existing one.</p>
      <p>Please refer to our <Link to='/privacy'>Privacy Policy</Link> to learn how your data is collected and used.</p>
    </div>
   );
}
 
export default About;