import React, { useEffect, useState } from "react";
import { LogOut, CheckCircle } from "lucide-react";

const Logout = () => {
  const [countdown, setCountdown] = useState(3);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    // Simulation de la déconnexion (sans localStorage pour les artefacts Claude)
    const performLogout = () => {
      // Dans un vrai projet, vous utiliseriez :
      // localStorage.removeItem("user");
      // sessionStorage.clear();
      // Ou appeler une API de déconnexion
      
      setIsLoggedOut(true);
    };

    // Effectuer la déconnexion immédiatement
    performLogout();

    // Gérer le compte à rebours
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Dans un vrai projet, vous utiliseriez :
          // navigate("/login");
          console.log("Redirection vers la page de connexion");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Nettoyage à la destruction du composant
    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  // Fonction pour redirection immédiate
  const handleImmediateRedirect = () => {
    console.log("Redirection immédiate vers la page de connexion");
    // Dans un vrai projet : navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        {/* Icône avec animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-green-500 rounded-full p-4 inline-block">
            <CheckCircle className="text-white text-4xl" size={48} />
          </div>
        </div>

        {/* Titre avec gradient */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Déconnexion réussie
        </h1>

        {/* Message de confirmation */}
        <p className="text-gray-600 mb-6 text-lg">
          Merci de votre visite ! Vous avez été déconnecté(e) avec succès.
        </p>

        {/* Compte à rebours avec barre de progression */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            Redirection automatique dans{" "}
            <span className="font-bold text-blue-600 text-lg">
              {countdown}
            </span>{" "}
            seconde{countdown > 1 ? "s" : ""}
          </p>
        </div>

        {/* Bouton de redirection immédiate */}
        <button
          onClick={handleImmediateRedirect}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
          disabled={countdown === 0}
        >
          <LogOut className="inline mr-2" size={20} />
          Se connecter maintenant
        </button>

        {/* Message de sécurité */}
        <p className="text-xs text-gray-400 mt-4">
          Pour votre sécurité, toutes vos données de session ont été effacées.
        </p>
      </div>
    </div>
  );
};

export default Logout;