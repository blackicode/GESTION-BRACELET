// Importation des images
import imageAccueil1 from "/src/assets/images/slide1.png";
import imageAccueil2 from "/src/assets/images/slide2.png";
import imageAccueil3 from "/src/assets/images/slide3.png";
import imageAccueil4 from "/src/assets/images/slide4.png";
import imageAccueil5 from "/src/assets/images/photo_gamal.png";
import imageAccueil6 from "/src/assets/images/profil.png";
import imageAccueil7 from "/src/assets/images/image2.png";
import "./Styles2.css";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [imageAccueil1, imageAccueil2, imageAccueil3, imageAccueil4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000); // Changement d'image toutes les 3 secondes

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full min-h-screen py-2 px-2">
      {/* Diaporama */}
      <div className="diapo">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Section Images */}
      <div className="banniere-images">
        <img  src={imageAccueil5} alt="Logo 1" />
        <img src={imageAccueil6} alt="Logo 2" />
        <img src={imageAccueil7} alt="Logo 3" />
      </div>

      {/* Contenu de la bannière */}
      <div className="banniere-contenu">
        <h1 className="banniere-titre">BONJOUR, BIENVENUE SUR <br />ENTACIG !</h1>

        <h2 className="banniere-sous-titre">🌍 À propos d'ENTACIG</h2>

        <p className="banniere-texte">
          <strong>ENTACIG</strong> est une plateforme numérique innovante dédiée à la
          <strong> gestion, la communication et la sécurité (domotique)</strong> au sein du Centre Informatique
          de l'Université <strong>Gamal Abdel Nasser de Conakry</strong>.
        </p>

        <p className="banniere-texte">
          Avec <strong>ENTACIG</strong>, la transformation numérique devient une réalité, offrant un cadre propice à
          <strong> l'apprentissage, l'innovation et la gestion efficace des ressources éducatives</strong>.
        </p>
      </div>
    </div>
  );
}
