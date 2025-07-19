import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt,faSpinner } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);// État pour afficher/cacher la fenêtre modale// État pour stocker le mot de passe entré par l'utilisateur

  useEffect(() => {
    // Essayez d'extraire les informations de l'utilisateur à partir du localStorage
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user")).user;
    console.log(userFromLocalStorage);

    if (userFromLocalStorage) {
      setUser(userFromLocalStorage);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

 
  
  return (
    <div className="py-10 px-10 text-center">
      <div className="bg-white shadow-md p-6 rounded-lg">
        <FontAwesomeIcon icon={faUserAlt} className="text-6xl mb-4" />
        <h1 className="text-5xl font-semibold">Profil de l'Utilisateur</h1>
        {loading ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">Chargement du profil  en cours...</span>
          <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-3xl" />
        </div>
      ) :user ? (
          <div className="mt-10">
            <p className="text-3xl font-semibold">
              <strong>Prénom :</strong> {user.firstName}
            </p>
            <p className="text-3xl font-semibold pt-2">
              <strong>Nom :</strong> {user.lastName}
            </p>
            <p className="text-3xl font-semibold pt-2">
              <strong>Email :</strong> {user.email}
            </p>

          </div>
        ) : (
          <p>Les informations de l'utilisateur ne sont pas disponibles.</p>
        )}
      </div>


    </div>
  );
};

export default Profile;
