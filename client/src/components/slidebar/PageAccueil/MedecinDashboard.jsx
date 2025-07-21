import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedecinDashboard = () => {
  const { id } = useParams();
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

  if (loading) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenue, Dr. {medecin.firstName} {medecin.lastName}</h1>

      <div className="flex flex-col items-center space-y-4 border p-6 rounded-md shadow-lg bg-white">
        <img
          src={medecin.photo || "/default-avatar.png"}
          alt="Photo de profil"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="text-lg font-medium">Spécialité : {medecin.specialite || "Non spécifiée"}</div>
        <div>Email : <span className="text-gray-700">{medecin.email}</span></div>
      </div>
    </div>
  );
};

export default MedecinDashboard;
