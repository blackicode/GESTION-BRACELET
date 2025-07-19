import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link,useNavigate } from "react-router-dom";

const Logout = () => {
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Effacez les informations de l'utilisateur du localStorage
    localStorage.removeItem("user");

    // Utilisez setTimeout pour définir une redirection après un délai 
    const redirectTimeout = setTimeout(() => {
      setRedirect(true); 
      navigate("/")
      // Activez la redirection après le délai
    }, 3000); // Délai en millisecondes (ici, 3 secondes)

    // Nettoyez le timeout lorsque le composant est démonté pour éviter les fuites de mémoire
    return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FontAwesomeIcon icon={faSignOutAlt} className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-semibold mb-2">Déconnexion réussie</h1>
      <p className="mb-4">Merci de votre visite !</p>
    </div>
  );
};

export default Logout;
