import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./menu_item";
import { Home, Settings, Upload, Airplay, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ role, level, user, onPhotoChange }) {
  const [currentto, setCurrentto] = useState(
    window.location.pathname.split("/")[2] || ""
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const commonItems = [
    { title: "Accueil", to: "medecindashboard", icon: <Home className="w-6 h-6" /> },
    { title: "Paramètres", to: "settings", icon: <Settings className="w-6 h-6" /> },
  ];

  const items = [...commonItems, ...([role]?.[level] || [])];

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
      className={`fixed h-screen overflow-y-auto bg-blue-600 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
       {/* Bouton réduction/agrandissement */}
       <div className="flex justify-center mt-14">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white text-blue-600 rounded-full p-2 shadow-md hover:bg-blue-200 transition-all"
          title={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      

       {/* Profil utilisateur */}
       <div className="flex flex-col items-center mt-10 transition-all duration-300">
        <img
          src={user?.photo || ""}
          alt="Profil"
          className={`rounded-full object-cover transition-all duration-300 ${
            isCollapsed ? "w-10 h-10" : "w-16 h-16"
          }`}
        />

        {!isCollapsed && (
          <div className="text-center mt-2 space-y-1 px-2">
            <p className="text-sm font-semibold">{user?.userType || "Type Inconnu"}</p>
            <p className="text-xs truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs truncate">{user?.email}</p>

            <button
              className="mt-1 bg-white text-blue-600 px-2 py-1 text-xs rounded flex items-center gap-1 mx-auto"
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
          </div>
        )}
      </div>
      {/* Menu navigation */}
      <div className="px-2 mt-6 space-y-1">
        {items.map((item) => (
          <Link
            key={item.title}
            to={`/dashboard/${item.to}`}
            className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-blue-700 transition-all ${
              currentto === item.to ? "bg-blue-800" : ""
            }`}
            onClick={() => setCurrentto(item.to)}
          >
            <span>{item.icon}</span>
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">
                {item.title}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
