import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./menu_item";
import { Home, Settings, Upload, Airplay } from "lucide-react";

export default function Sidebar({ role, level, user, onPhotoChange }) {
  const [currentto, setCurrentto] = useState(
    window.location.pathname.split("/")[2] || ""
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const commonItems = [
    { title: "Accueil", to: "", icon: <Home className="w-6 h-6" /> },
    { title: "Paramètres", to: "settings", icon: <Settings className="w-6 h-6" /> },
  ];

  const items = [...commonItems, ...([role]?.[level] || [])];

  // Fonction pour jouer le son
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Fonction pour gérer le changement de photo
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && onPhotoChange) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`fixed h-screen overflow-y-auto bg-blue-600 text-white transition-all duration-200 ease-in-out ${
        isCollapsed ? "w-20" : "w-56"
      }`}
    >
      {/* Section Profil */}
      <div className={`mt-16 flex flex-col items-center ${isCollapsed ? "w-20" : "w-56"}`}>
        <img
          src={user?.photo || ""}
          alt="Profil"
          className={`rounded-full object-cover transition-all ${
            isCollapsed ? "w-10 h-10" : "w-16 h-16"
          }`}
        />
        {!isCollapsed && (
          <p className="mt-2 text-sm font-semibold">
            {user?.userType || "Type Inconnu"}
          </p>
        )}

        {/* Bouton pour changer la photo de profil */}
        {!isCollapsed && (
          <>
            <button
              className="mt-2 bg-white text-blue-600 px-2 py-1 text-xs rounded flex items-center gap-1"
              onClick={() => fileInputRef.current.click()}
            >
              <Upload className="w-4 h-4" /> Changer Photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Bouton pour réduire/étendre la sidebar */}
      <div
        className="flex justify-center mt-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <Airplay className="w-6 h-6" />
        ) : (
          <Airplay className="w-6 h-6 rotate-180" />
        )}
      </div>

      {/* Menu */}
      <div className="px-2 mt-4">
        {items.map((item) => (
          <MenuItem
            key={item.title}
            currentto={currentto}
            setCurrentto={setCurrentto}
            title={item.title}
            to={item.to}
            onClick={playSound}
          >
            {item.icon}
          </MenuItem>
        ))}
      </div>

      {/* Audio de clic */}
      <audio ref={audioRef} src="/click-sound.mp3" />
    </div>
  );
}
