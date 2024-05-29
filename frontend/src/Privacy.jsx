const Privacy = () => {
  // This is mostly here to let the user know that the app does store some information in the SQL database (if this was to actually be published on the web).
  // I have no intention to publish this to the web, and any data stored will instead be saved on the user's computer in the backend's db file. - hwrd22
  return ( 
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <h2>Introduction</h2>
      <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
      <h2>Information Collection</h2>
      <h3>Types of Information Collected</h3>
      <p>We collect personal information such as your email address, username, and contacts that you create.</p>
      <h3>Methods of Collection</h3>
      <p>We collect information when you create an account or use our website's services.</p>
      <h2>Use of Information</h2>
      <p>We use your information to provide and improve our services.</p>
      <h2>Information Sharing and Disclosure</h2>
      <p>We may share your information with legal authorities when required.</p>
      <h2>Data Retention</h2>
      <p>We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>
      <h2>Security Measures</h2>
      <p>We implement appropriate technical and organizational measures to protect your personal data.</p>
      <h2>User Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and update your information</li>
        <li>Request data deletion</li>
        <li>Object to data processing</li>
        <li>Withdraw consent</li>
      </ul>
      <h2>Cookies and Tracking Technologies</h2>
      <p>We may use cookies to keep you logged in. You can manage your cookie preferences through your browser settings.</p>
      <h2>Children's Privacy</h2>
      <p>We do not knowingly collect information from children under 13 without parental consent.</p>
      <h2>Changes to the Privacy Policy</h2>
      <p>We may update this policy from time to time. The latest version will be posted on our website with the date of the last update.</p>
    </div>
   );
}
 
export default Privacy;