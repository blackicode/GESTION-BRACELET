import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailValidation = () => {
  const [verifCode, setVerifCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook pour la navigation

  const handleValidation = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.patch("http://localhost:5000/auth/validation", { verifCode });
      setMessage(response.data);

      // Redirige vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Vérification de l'email</h2>

        {/* ✅ Message ajouté ici */}
        <p className="text-gray-600 text-center mb-2">
          Un message a été envoyé sur votre boîte email, veuillez le vérifier afin de finaliser votre inscription.
        </p>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form onSubmit={handleValidation} className="space-y-4">
          <input
            type="text"
            placeholder="Entrez le code de vérification"
            value={verifCode}
            onChange={(e) => setVerifCode(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailValidation;
