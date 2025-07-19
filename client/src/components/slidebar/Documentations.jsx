import React, { useState } from "react";
import { FaEye, FaDownload, FaFilePdf, FaImage, FaBook, FaTimes } from "react-icons/fa";

const documents = [
  {
    id: 1,
    name: "Guide d'installation - Capteur de température (DHT11)",
    file: "/public/docs/dht11.png",
    type: "image",
  },
  {
    id: 2,
    name: "Guide d'installation - Capteur de température (DHT22)",
    file: "/public/docs/dht22.jpg",
    type: "image",
  },
  {
    id: 3,
    name: "Schéma - Capteur de fumée et gaz",
    file: "/public/docs/fumee.png",
    type: "image",
  },
  {
    id: 4,
    name: "Guide - Capteur de mouvement",
    file: "/public/docs/mouvement.png",
    type: "image",
  },
  {
    id: 5,
    name: "Manuel - Lecteur d'empreinte digitale R307S",
    file: "/public/docs/empreinte.jpg",
    type: "image",
  },
  {
    id: 6,
    name: "Guide - Clavier 4X4 externe",
    file: "/public/docs/clavier.png",
    type: "image",
  },
  {
    id: 7,
    name: "Manuel - RFID",
    file: "/public/docs/rfid.png",
    type: "pdf",
  },
  {
    id: 7,
    name: "Guide d'installation - Arduino uno et esp32",
    file: "/public/docs/ardesp32.png",
    type: "pdf",
  },
];

// Documents ENTACIG
const entacigDocument = {
  name: "📘 Document complet du projet ENTACIG",
  file: "/public/docs/document.pdf",
};

const entacigPresentation = {
  name: "🎤 Présentation du projet ENTACIG",
  file: "/public/docs/presentation.pdf",
};

const DocumentationPage = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDocEntacig, setSelectedDocEntacig] = useState(null);
  const [selectedDocEntacigPresentation, setSelectedDocEntacigPresentation] = useState(null);

  // Fonction pour afficher ou masquer un document
  const toggleDocument = (file, type = "") => {
    if (type === "entacig") {
      setSelectedDocEntacig(selectedDocEntacig === file ? null : file);
    } else if (type === "presentation") {
      setSelectedDocEntacigPresentation(selectedDocEntacigPresentation === file ? null : file);
    } else {
      setSelectedDoc(selectedDoc === file ? null : file);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📚 Documentation</h1>

      {/* Section du document complet ENTACIG */}
      <div className="bg-white p-6 rounded shadow mb-6 flex items-center">
        <FaBook className="text-5xl text-indigo-600 mr-4" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{entacigDocument.name}</h2>
          <div className="mt-2 flex space-x-4">
            <button
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => toggleDocument(entacigDocument.file, "entacig")}
            >
              {selectedDocEntacig ? (
                <>
                  <FaTimes className="mr-2" /> Masquer
                </>
              ) : (
                <>
                  <FaEye className="mr-2" /> Consulter
                </>
              )}
            </button>
            <a
              href={entacigDocument.file}
              download
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FaDownload className="mr-2" /> Télécharger
            </a>
          </div>

          {selectedDocEntacig && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <iframe src={selectedDocEntacig} className="w-full h-96 border" />
            </div>
          )}
        </div>
      </div>

      {/* Section de la présentation ENTACIG */}
      <div className="bg-white p-6 rounded shadow mb-6 flex items-center">
        <FaBook className="text-5xl text-indigo-600 mr-4" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{entacigPresentation.name}</h2>
          <div className="mt-2 flex space-x-4">
            <button
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => toggleDocument(entacigPresentation.file, "presentation")}
            >
              {selectedDocEntacigPresentation ? (
                <>
                  <FaTimes className="mr-2" /> Masquer
                </>
              ) : (
                <>
                  <FaEye className="mr-2" /> Consulter
                </>
              )}
            </button>
            <a
              href={entacigPresentation.file}
              download
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <FaDownload className="mr-2" /> Télécharger
            </a>
          </div>

          {selectedDocEntacigPresentation && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <iframe src={selectedDocEntacigPresentation} className="w-full h-96 border" />
            </div>
          )}
        </div>
      </div>

      {/* Liste des autres documents */}
      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded shadow flex items-center">
            <div className="text-4xl text-blue-500 mr-4">
              {doc.type === "pdf" ? <FaFilePdf /> : <FaImage />}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{doc.name}</h2>
              <div className="mt-2 flex space-x-4">
                <button
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => toggleDocument(doc.file)}
                >
                  {selectedDoc === doc.file ? (
                    <>
                      <FaTimes className="mr-2" /> Masquer
                    </>
                  ) : (
                    <>
                      <FaEye className="mr-2" /> Voir
                    </>
                  )}
                </button>
                <a
                  href={doc.file}
                  download
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  <FaDownload className="mr-2" /> Télécharger
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Affichage du document sélectionné */}
      {selectedDoc && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">🔍 Aperçu</h2>
            <button
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setSelectedDoc(null)}
            >
              <FaTimes className="mr-2" /> Fermer
            </button>
          </div>
          <iframe src={selectedDoc} className="w-full h-96 border" />
        </div>
      )}
    </div>
  );
};

export default DocumentationPage;