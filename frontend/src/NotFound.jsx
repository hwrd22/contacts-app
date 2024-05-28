import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = '404 Not Found';

    // Create a meta tag for robots
    const metaTag = document.createElement('meta');
    metaTag.name = 'robots';
    metaTag.content = 'noindex, nofollow';
    document.head.appendChild(metaTag);

    // Cleanup function to remove the meta tag when the component unmounts
    return () => {
      document.head.removeChild(metaTag);
    };
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