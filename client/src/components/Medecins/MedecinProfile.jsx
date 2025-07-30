import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedecinProfile = () => {
  const { id } = useParams();
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedecin = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/medecin/${id}`);
        setMedecin(response.data);
      } catch (err) {
        setError("Impossible de charger les informations du médecin.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedecin();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec photo et informations principales */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>
          
          <div className="relative px-8 pb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-16">
              <div className="relative">
                <img
                  src={medecin.photo || "/default-avatar.png"}
                  alt={`Dr. ${medecin.firstName} ${medecin.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl font-bold text-white-800 mb-2">
                  Dr. {medecin.firstName} {medecin.lastName}
                </h1>
                <p className="text-xl text-blue-600 font-semibold mt-8 mb-4">
                  {medecin.specialite || "Médecin Généraliste"}
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-blue-600 mr-2">📧</span>
                    <span className="text-gray-700">{medecin.email}</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                    <span className="text-green-600 mr-2">📞</span>
                    <span className="text-gray-700">{medecin.phone || "Non renseigné"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations détaillées */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Informations professionnelles */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-blue-600 mr-3">👨‍⚕️</span>
              Informations Professionnelles
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Spécialité Médicale</h3>
                <p className="text-gray-600 text-lg">{medecin.specialite || "Médecine Générale"}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Description Professionnelle</h3>
                <p className="text-gray-600 leading-relaxed">
                  {medecin.description || 
                    `Dr. ${medecin.firstName} ${medecin.lastName} est un professionnel de santé dévoué avec une expertise approfondie en ${medecin.specialite || 'médecine générale'}. Avec des années d'expérience dans le domaine médical, le docteur s'engage à fournir des soins de qualité supérieure à tous ses patients, en adoptant une approche personnalisée et bienveillante pour chaque consultation.`
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Domaines d'Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {(medecin.expertises || [
                    'Consultation générale',
                    'Diagnostic médical',
                    'Suivi thérapeutique',
                    'Prévention santé'
                  ]).map((expertise, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {expertise}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Informations de contact et statistiques */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-green-600 mr-2">📞</span>
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-30">Email: </span>{" "}{" "} 
                  <span className="text-gray-700 flex-1">{medecin.email}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-20">Tél:</span>
                  <span className="text-gray-700 flex-1">{medecin.phone || "Non renseigné"}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-20">Statut:</span>
                  <span className="inline-flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Disponible
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">📊</span>
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expérience</span>
                  <span className="font-semibold text-gray-800">{medecin.experience || '5+'} ans</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Patients suivis</span>
                  <span className="font-semibold text-gray-800">{medecin.nombrePatients || '500+'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Note moyenne</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-semibold text-gray-800">{medecin.note || '4.8'}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Prendre Rendez-vous</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Consultez Dr. {medecin.lastName} pour vos besoins de santé
              </p>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Réserver une consultation
              </button>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <span className="mr-2">🕐</span>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecinProfile;