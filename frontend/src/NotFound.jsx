import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = '404 Not Found';
  }, []);
  
  return ( 
    <div className="page-not-found">
      <h1>404</h1>
      <h3>404 - That's an Error.</h3>
      <div>The page you requested could not be found.</div>
    </div>
   );
}
 
export default NotFound;