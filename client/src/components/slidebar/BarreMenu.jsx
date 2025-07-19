import React, { useState } from 'react';
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faBars, faFan, faLightbulb } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    const [isClimOn, setIsClimOn] = useState(false);
    const [isLightOn, setIsLightOn] = useState(false);
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(() => location.pathname.split("/")[2] || "");

    const toggleClim = () => {
        setIsClimOn(!isClimOn);
        console.log(`Climatisation ${!isClimOn ? "allumée" : "éteinte"}`);
    };

    const toggleLight = () => {
        setIsLightOn(!isLightOn);
        console.log(`Lumière ${!isLightOn ? "allumée" : "éteinte"}`);
    };

    return (
        <div className="bg-blue-600 ml-30 text-white p-4 rounded-md">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold">ENTACIG</h1>
                <Header />
                <div className="flex space-x-4">
                    <MenuItem link="" title="Accueil" activeLink={activeLink} setActiveLink={setActiveLink}>
                        <FontAwesomeIcon icon={faBars} className="mr-2" />
                    </MenuItem>
                    <MenuItem link="/dashboard/docs" title="Documentations" activeLink={activeLink} setActiveLink={setActiveLink}>
                        <FontAwesomeIcon icon={faBars} className="mr-2" />
                    </MenuItem>
                    <MenuItem link="/dashboard/nombreconect" title="Nombre de membres" activeLink={activeLink} setActiveLink={setActiveLink}>
                        <FontAwesomeIcon icon={faBars} className="mr-2" />
                    </MenuItem>

                    {/* Boutons avec icônes */}
                    <button onClick={toggleClim} className="px-4 py-2 fz-26 rounded-md border hover:opacity-80">
                        <FontAwesomeIcon 
                            icon={faFan} 
                            className={`text-2xl ${isClimOn ? "text-green-500 " : "text-red-500"}`} 
                        />
                    </button>

                    <button onClick={toggleLight} className="px-4 py-2 rounded-md border hover:opacity-80">
                        <FontAwesomeIcon 
                            icon={faLightbulb} 
                            className={`text-2xl ${isLightOn ? "text-yellow-500" : "text-gray-500"}`} 
                        />
                    </button>

                    <MenuItem link="Logout" title="Déconnexion" activeLink={activeLink} setActiveLink={setActiveLink} className="text-red-500">
                        <FontAwesomeIcon icon={faSignOut} className="mr-2 fz-36 text-red-500" />
                    </MenuItem>
                </div>
            </div>
        </div>
    );
}

const MenuItem = ({ title, link, children, activeLink, setActiveLink }) => {
    const isActive = activeLink === link;

    return (
        <Link to={link} onClick={() => setActiveLink(link)}>
            <div className={`flex items-center space-x-2 py-2 px-2 hover:bg-gray rounded-md text-white cursor-pointer ${isActive ? "bg-gray text-blue-800" : ""}`}>
                <div className="w-6 h-6 rounded-full">{children}</div>
                <h1 className="text-md font-medium">{title}</h1>
            </div>
        </Link>
    );
};
