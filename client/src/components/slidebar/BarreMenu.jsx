import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoEntacig2 from "/src/assets/images/logoEntacig2.png";

// Icônes émulées via emojis
const icons = {
  faSignOut: "🚪",
  faBars: "🏠",
  faFan: "👥",
  faLightbulb: "📖",
  faBell: "🔔",
  faEnvelope: "✉️",
  faUser: "👤",
  faSearch: "🔍",
  faChevronDown: "▼"
};



export default function BarreMenu() {
  const [activeLink, setActiveLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedecin = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/medecin/${id}`);
        setMedecin(response.data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de charger les informations du médecin.");
        setLoading(false);
      }
    };

    fetchMedecin();
  }, [id]);
  const [currentto, setCurrentto] = useState(
    window.location.pathname.split("/")[2] || ""
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  //   if (e.target.value.length > 1) {
  //     setSearchResults(mockSearchResults.filter(user =>
  //       user.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //       user.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //       user.braceletId.toLowerCase().includes(e.target.value.toLowerCase())
  //     ));
  //   } else {
  //     setSearchResults([]);
  //   }
  // };


  const [searchError, setSearchError] = useState(null);

  // Dans handleSearchChange
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchError(null);

    if (query.length > 1) {
      const token = localStorage.getItem('token');
      if (!token) {
        setSearchError('Utilisateur non authentifié. Veuillez vous reconnecter.');
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/patient/search?query=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error.response?.data || error.message);
        setSearchError(error.response?.data?.message || 'Une erreur est survenue lors de la recherche');
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Fonction pour gérer le clic sur un résultat et réinitialiser
  const handleResultClick = (id) => {
    navigate(`/dashboard/patientprofile/${id}`); // Navigation vers le profil du patient
    setSearchQuery(""); // Réinitialiser le champ de recherche
    setSearchResults([]); // Vider les résultats
    setSearchError(null); // Réinitialiser les erreurs, si nécessaire
  };

  // Dans le JSX, ajoutez l'affichage de l'erreur
  {
    searchError && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-red-100 text-red-800 rounded-xl shadow-xl z-20 p-2">
        {searchError}
      </div>
    )
  }



  const toggleDropdown = () => setShowDropdown(!showDropdown);
  // Nouvelle fonction pour gérer la navigation et fermer le menu déroulant
  const handleProfileClick = () => {
    setShowDropdown(false); // Ferme le menu déroulant
    navigate(`/dashboard/medecinprofile/${id}`); // Navigue vers le profil
  };

  // Nouvelle fonction pour gérer la déconnexion
  const handleLogoutClick = () => {
    setShowDropdown(false); // Ferme le menu déroulant
    navigate("/logout"); // Navigue vers la déconnexion
  };
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-xl w-full shadow-2xl">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <img className="w-28 h-12" src={logoEntacig2} alt="Logo ENTACIG" />

        {/* Barre de recherche */}
        <div className="relative flex-1 max-w-md mx-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Rechercher par nom ou Bracelet ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/30 bg-white/10 backdrop-blur text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 transition-all duration-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">{icons.faSearch}</span>

          {searchError && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-red-100 text-red-800 rounded-xl shadow-xl z-20 p-2">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-black rounded-xl shadow-xl z-20 transition-all duration-300 ease-out animate-fade-in">
              <div className="p-2 max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleResultClick(user._id)} // Utiliser la nouvelle fonction
                    className="flex justify-between items-center p-2 hover:bg-blue-100 cursor-pointer rounded transition-colors duration-200"
                  >
                    <span><strong>{user.firstName} {user.lastName}</strong></span>
                    <span className="text-sm">ID: {user.braceletId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu de navigation */}
        <div className="flex items-center space-x-4">
          <MenuItem to="/dashboard" icon={icons.faBars} title="Accueil" activeLink={activeLink} setActiveLink={setActiveLink} />
          <MenuItem to="/dashboard/mespatients" icon={icons.faFan} title="Voir Mes Patients" activeLink={activeLink} setActiveLink={setActiveLink} />
          <MenuItem to="/dashboard/messagerie" icon={icons.faEnvelope} title="Messagerie" badgeCount={1} activeLink={activeLink} setActiveLink={setActiveLink} />
          <MenuItem to="/dashboard/notifications" icon={icons.faBell} title="Notifications" badgeCount={3} activeLink={activeLink} setActiveLink={setActiveLink} />
        </div>

        {/* Menu utilisateur */}
        {/* Menu utilisateur */}
        <div className="relative ml-6">
          <button onClick={toggleDropdown} className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
            <img
              src={medecin?.photo || ""}
              alt="Profil"
              className="w-8 h-8 rounded-full"
            />
            <span>Vous</span>
            <span>{icons.faChevronDown}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-lg z-30 transform origin-top-right animate-fade-in">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={medecin?.photo || ""}
                    alt="Profil"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{medecin?.firstName} {medecin?.lastName}</p>
                    <button
                      onClick={handleProfileClick} // Utiliser la nouvelle fonction
                      className="text-sm text-blue-600 hover:underline transition-colors duration-200"
                    >
                      Voir profil
                    </button>
                  </div>
                </div>
                <hr className="my-2" />
                <button
                  onClick={handleLogoutClick} // Utiliser la nouvelle fonction
                  className="flex items-center space-x-2 px-3 py-2 w-full text-left hover:bg-gray-100 rounded transition duration-200"
                >
                  <span>{icons.faSignOut}</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div >
  );
}

// Composant MenuItem
const MenuItem = ({ to, icon, title, badgeCount = 0, activeLink, setActiveLink }) => {
  const isActive = window.location.pathname.includes(to);

  return (
    <Link to={to} onClick={() => setActiveLink(to)} className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl ${isActive ? "bg-white/20" : "hover:bg-white/10"} transition-all duration-300`}>
      <span>{icon}</span>
      <span>{title}</span>
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-2 animate-pulse">{badgeCount}</span>
      )}
    </Link>
  );
};
