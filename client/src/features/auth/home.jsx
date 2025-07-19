import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import imageAccueil from "/src/assets/images/home.png";
import imageCentre from "/src/assets/images/logo_main.jpg";
import imageGamal from "/src/assets/images/home.jfif";
import imgageMembre1 from "/src/assets/images/profil.png";
import imgageMembre2 from "/src/assets/images/profil.png";
import imageMembre3 from "/src/assets/images/profil.png";
import imageMembre4 from "/src/assets/images/profil.png";
import "./Styles.css"; // Assurez-vous de créer ce fichier CSS pour les animations
import FooterPage from './footer';
import imageBerete from "/src/assets/images/profil.png";
import imageBeko from "/src/assets/images/beko.jpg";


export default function WelcomePage() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="flex flex-col h-screen">


      <h1 className="text-4xl font-bold mt-2 text-blue-500 flex justify-center ">ENTACIG</h1>
      <div className="header ml-5 relative">
        <button onClick={toggleMenu} className="menu-button felt-0 mt-2  text-blod  rounded">☰ Menu</button>
        <div className={` absolute  mt-2   border border-gray-200 rounded shadow-lg ${showMenu ? 'block' : 'hidden'}`}>
          <a href="/guideentacig" className="block w-full text-left px-4 py-2 hover:bg-gray-200">Guide</a>
          <a href="/histoirecentre" className="block w-full text-left px-4 py-2 hover:bg-gray-200" >Histoire</a>
          <a href="/moncontact" className="block w-full text-left px-4 py-2 hover:bg-gray-200" >Contactez l'administrateur</a>
          <a href="/" className="block w-full text-left px-4 py-2 hover:bg-gray-200" > Autre page</a>
          {/* <button onClick={() => handleMenuOption('clear')} className="block w-full text-left px-4 py-2 text-blod-200">Effacer le contenu</button>
            <a href="/dashboard/connecte-members" className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => handleMenuOption('members')}>Afficher les membres connectés</a>
            <button onClick={handleLogout} className=" menu block w-full text-left px-4 py-2 hover:bg-gray-200">Déconnexion</button> */}
        </div>
      </div>
      {/* Présentation de l'application */}
      <section className="bg-white text-blue-500 py-1 flex">

        <div className="w-1/2 text-center rounded-sm bg-gray-100 mt-4 ml-5 py-12 mb-20">
          <h1 className="text-7xl font-bold mb-4">Bienvenue</h1>
          <h2 className="text-black text-lg mt-10 mb-6">
            Félicitations pour avoir terminé avec succès  développement de cette application  dans le cadre du projet ENTACIG. Nous somme maintenant prêt(e) à explorer notre application de <mark className='bg-blue-500 text-white'> système sécurité et d'alerte precoce</mark>. Nous sommes ravis de vous accompagner dans la gestion de votre parcours académique, simplifiant ainsi votre expérience universitaire.
          </h2>
          <Link
            to="/login"
            className="bg-blue-500 mr-4 text-white hover:bg-blue-800 font-bold py-2 px-10 mt-18 rounded-lg inline-block"
          >
            Démarrer
          </Link>

        </div>
        <div className="w-5/6">
          <img
            src={imageAccueil}
            alt="Illustration"
            className="w-full"
          />
        </div>
      </section>

      <div >
        <div >

          <div>

            <div className="marquee text-black text-lg mt-10 mb-6">
              <p>
                Chèrs utilisateurs,

                Nous avons le plaisir de vous inviter à découvrir notre application exceptionnels d'ENTACIG ! Que vous recherchiez des solutions educatives innovantes, des taux compétitifs ou un service clientèle personnalisé, ENTACIG est là pour répondre à tous vos besoins educatives.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Présentation d'entacig */}
      <section className="bg-gray-100 py-16 flex">
        <div className="w-1/2 flex justify-center items-center">
          <img
            src={imageGamal}

            alt="Logo "
            className="w-60 h-auto mr-5"
          />
          <img
            src={imageCentre}
            alt="Logo "
            className="w-80 h-auto"
          />
        </div>

        <div className="w-1/2 mt-8 ml-0">
          <div className="bg-white p-4 ml-10 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Espace Numérique de Technologie d’Alerte du Centre Informatique de Gamal</h2>
            <p className="text-gray-600 mb-4">
              Centre (entacig) est une division de plusieurs formations de l'infromatique qui soutient le développement professionnel dans les domaines du développement web et de la technologie. Nous exprimons notre gratitude pour leur engagement dans la formation et le développement des talents à travers cette initiative.
            </p>
            <p className="text-gray-600 mb-4">
              Nous remercions le Centre Informatique de Gamal pour l'opportunité d'acquérir des compétences essentielles en développement de cette application de sécurité et nous sommes impatients de mettre en pratique ces compétences dans le cadre du projet ENTACIG.
            </p>
          </div>
        </div>
      </section >

      {/* Membres  */}
      < section className="bg-gray-100 py-16" >
        <h2 className="text-2xl font-bold text-center mb-4">MEMBRES D'ENTACIG</h2>
        <div className="overflow-hidden">
          <div className="flex animate-scroll">
            {/* Dupliquer les membres pour créer l'effet de défilement infini */}
            {[imgageMembre1, imgageMembre2].map((image, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
                <img
                  src={image}
                  alt={`Membre ${index + 1}`}
                  className="w-80 h-80 rounded-full mb-4 mx-auto"
                />
                <a href="/parcourcadre" className="view-all-button flex justify-center">DR IBRAHIMA KALIL TOURE </a>
                <p className="text-gray-600 text-center">DIRECTEUR GENENAL D'ENTACIG</p>
              </div>
            ))}
            {[imageBeko].map((image, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
                <img
                  src={image}
                  alt={`Membre ${index + 1}`}
                  className="w-80 h-80 rounded-full mb-4 mx-auto"
                />
                <a href="/parcourcadre" className="view-all-button flex justify-center">MADAME </a>
                <p className="text-gray-600 text-center">SCRETAIRE GENENAL D'ENTACIG</p>
              </div>
            ))}
            {[imageMembre3].map((image, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
                <img
                  src={image}
                  alt={`Membre ${index + 1}`}
                  className="w-80 h-80 rounded-full mb-4 mx-auto"
                />
                <a href="/parcourcadre" className="view-all-button flex justify-center">DR MOHAMED CONTE </a>
                <p className="text-gray-600 text-center">DIRECTEUR DES ETUDUES D'ENTACIG</p>
              </div>
            ))}
            {[ imageBeko].map((image, index) => (
              <div key={index} className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
                <img
                  src={image}
                  alt={`Membre ${index + 1}`}
                  className="w-80 h-80 rounded-full mb-4 mx-auto"
                />
                <a href="/parcourcadre" className="view-all-button flex justify-center">MOUCTAR BARRY </a>
                <p className="text-gray-600 text-center">CHEF DE DEPARTEMENT DE NTIC</p>
              </div>
            ))}
            {[imgageMembre1].map((image, index) => (
              <div key={index + 4} className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
                <img
                  src={image}
                  alt={`Membre ${index + 1}`}
                  className="w-80 h-80 rounded-full mb-4 mx-auto"
                /><a href="/parcourcadre" className="view-all-button flex justify-center"> KABA </a>
                <p className="text-gray-600 text-center">CHEF DE DEPARTEMENT DE DEVELOPPEMENT LOGICIEL</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Présentation de moi même */}
      < section className="bg-gray-200 py-10 flex" >
      <div className=" mt-2 ml-4">        
          <img
            src={imageBerete}
            alt="berete"
            className="w-40 h-40 rounded-full mb-4 mr-0"
          />
        
        
          <div className="bg-white p-4  rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Developpeur</h2>
            <h3 className="text-2xl font-semibold">MOUSSA BERETE</h3>
            <p className="text-gray-600 mb-10">Développeur Full-Stack JS #React, #React Native, Phython(#Flask, #Djago),<br/> #Symfony, #C/C++, #Next, #Nodejs, #Express, #Mongodb, #Prisma</p>
            <a className="text-white bg-blue-500 hover:bg-blue-700 rounded-lg px-10 py-2 mt-10" href="https://github.com/Blackicode">Github</a>
          </div>
        </div>
        <div className=" mt-2 ml-4">        
          <img
            src={imageBeko}
            alt="berete"
            className="w-40 h-40 rounded-full mb-4 mr-0"
          />
        
        
          <div className="bg-white p-4  rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Developpeur2</h2>
            <h3 className="text-2xl font-semibold">BEKO SAGNO</h3>
            <p className="text-gray-600 mb-10">Développeur Full-Stack JS #React, #Python, #Nodejs, #Symfony, #Mongodb, #c++</p>
          </div>
        </div>
      </section >

      {/* Footer */}
      <div >
      <FooterPage / >
      </div>
    </div >
    
  );
}

// {/* Membres du groupe */}
// <section className="bg-gray-100 py-16">
//   <h2 className="text-2xl font-bold text-center mb-4">Membres du groupe</h2>
//   <div className="overflow-x-auto">
//     <div className="flex">
//       {/* Membre 1 */}
//       <div className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
//         <img
//           src={imgageMembre1}
//           alt="Membre 1"
//           className="w-60 h-80 rounded-full mb-4 mx-auto"
//         />
//         <h2 className="text-lg font-bold text-center">Chef de groupe</h2>
//         <h3 className="text-lg font-semibold text-center">El Mamadou Lamarana Barry</h3>
//         <p className="text-gray-600 text-center">Étudiant en L2 licence informatique à Gamal</p>
//       </div>
//       {/* Membre 2 */}
//       <div className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
//         <img
//           src={imgageMembre2}
//           alt="Membre 2"
//           className="w-60 h-80 rounded-full mb-4 mx-auto"
//         />
//         <h3 className="text-lg font-semibold text-center">El Mamadou Lamarana Barry</h3>
//         <p className="text-gray-600 text-center">Étudiant en L2 licence informatique à Gamal</p>
//       </div>
//       {/* Membre 3 */}
//       <div className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
//         <img
//           src={imageMembre3}
//           alt="Membre 3"
//           className="w-60 h-80 rounded-full mb-4 mx-auto"
//         />
//         <h3 className="text-lg font-semibold text-center">El Mamadou Lamarana Barry</h3>
//         <p className="text-gray-600 text-center">Étudiant en L2 licence informatique à Gamal</p>
//       </div>
//       {/* Membre 4 */}
//       <div className="bg-white p-2 rounded-lg shadow-md mx-4 flex-shrink-0">
//         <img
//           src={imageMembre4}
//           alt="Membre 4"
//           className="w-60 h-80 rounded-full mb-4 mx-auto"
//         />
//         <h3 className="text-lg font-semibold text-center">El Mamadou Lamarana Barry</h3>
//         <p className="text-gray-600 text-center">Étudiant en L2 licence informatique à Gamal</p>
//       </div>
//     </div>
//   </div>
// </section>


