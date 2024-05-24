import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToHome = () => {
  const navigateTo = useNavigate();

  useEffect(() => {
    navigateTo('/');  // Automatically redirects user to home page
  }, []);

  return null;  // This component isn't supposed to render anything
}
 
export default RedirectToHome;