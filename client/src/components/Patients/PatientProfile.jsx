
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FiMessageSquare,
    FiBell,
    FiClipboard,
    FiTrendingUp,
    FiMap,
    FiCalendar,
} from "react-icons/fi";
import {
    MessageSquare,
    Bell,
    Clipboard,
    TrendingUp,
    Map,
    ArrowLeft,
    Phone,
    Mail,
    User,
    Activity,
    MapPin,
    Calendar,
    Shield

} from "lucide-react";


const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatient = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Veuillez vous connecter.");
            }

            const response = await axios.get(`http://localhost:5000/patient/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatient(response.data);
            setLoading(false);
        } catch (err) {
            if (err.message === "Veuillez vous connecter.") {
                toast.error("Session expirée. Veuillez vous reconnecter.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                const errorMessage =
                    err.response?.data?.message || "Impossible de charger le profil du patient.";
                setError(errorMessage);
                toast.error(errorMessage);
                setLoading(false);
            }
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchPatient();
    }, [fetchPatient]);




    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 font-medium animate-pulse">Chargement du profil...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-200">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                        <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Erreur</h3>
                    <p className="text-red-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-10 via-white to-purple-50">
            {/* Header avec gradient animé */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <button
                        onClick={() => navigate("/dashboard/mespatients")}

                        className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-200 mb-4 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span>Retour aux patients</span>
                    </button>
                    <h1 className="text-3xl font-bold text-center">
                        Profil de {patient.firstName} {patient.lastName}
                    </h1>
                    <p className="text-center text-blue-100 mt-2">Gestion complète du dossier patient</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-4 relative z-20">
                {/* Carte principale du profil */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
                    {/* Section photo et informations principales */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                            {/* Photo avec animation hover */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-xl">
                                    <img
                                        src={patient.photo || "/api/placeholder/128/128"}
                                        alt={`${patient.firstName} ${patient.lastName}`}
                                        className="w-full h-full rounded-full object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "/api/placeholder/128/128";
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                    <Activity className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="flex-1 space-y-4">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                        {patient.firstName} {patient.lastName}
                                    </h2>
                                    <p className="text-gray-600 font-medium">{patient.userType}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Type de maladie</p>
                                            <p className="font-semibold text-gray-900">{patient.typeMaladie}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Bracelet ID</p>
                                            <p className="font-semibold text-gray-900">{patient.braceletId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-semibold text-gray-900 text-sm">{patient.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Téléphone</p>
                                            <p className="font-semibold text-gray-900">{patient.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informations supplémentaires */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>
                                            Inscrit le{" "}
                                            {patient.dateInscription
                                                ? new Date(patient.dateInscription).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : "Non spécifié"}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Activity className="w-4 h-4" />
                                        <span>Dernière mesure: {patient.derniereMesure}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="p-8 bg-white">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Actions disponibles</h3>
                        {/* Icônes cliquables pour les fonctionnalités */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
                            <button
                                onClick={() => navigate(`/dashboard/patient/${id}/messaging`)}
                                className="flex flex-col items-center p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                aria-label="Messagerie"
                            >
                                <FiMessageSquare className="text-2xl text-blue-600" />
                                <span className="mt-2 text-sm font-medium text-gray-700">Messagerie</span>
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/patient/${id}/notifications`)}
                                className="flex flex-col items-center p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                aria-label="Notifications"
                            >
                                <FiBell className="text-2xl text-blue-600" />
                                <span className="mt-2 text-sm font-medium text-gray-700">Notifications</span>
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/patient/${id}/evaluation`)}
                                className="flex flex-col items-center p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                aria-label="Évaluation de la maladie"
                            >
                                <FiClipboard className="text-2xl text-blue-600" />
                                <span className="mt-2 text-sm font-medium text-gray-700">Évaluation</span>
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/patient/${id}/disease-progress`)}
                                className="flex flex-col items-center p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                aria-label="Graphique d'évolution"
                            >
                                <FiTrendingUp className="text-2xl text-blue-600" />
                                <span className="mt-2 text-sm font-medium text-gray-700">Graphique</span>
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/patient/${id}/map`)}
                                className="flex flex-col items-center p-4 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                aria-label="Voir la carte" badgeCount={1}
                            >
                                <FiMap className="text-2xl text-blue-600" />
                                <span className="mt-2 text-sm font-medium text-gray-700">Carte</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bouton de retour stylisé */}
                <div className="text-center pb-8">
                    <button
                        onClick={() => navigate("/dashboard/mespatients")}

                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span>Retour à la liste des patients</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

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

export default PatientProfile;



