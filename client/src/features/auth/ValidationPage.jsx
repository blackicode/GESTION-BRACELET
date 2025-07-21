import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailValidation = () => {
  const [verifCode, setVerifCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔄 Indique le chargement
  const navigate = useNavigate();

  const handleValidation = async (e) => {
    e.preventDefault();

    if (!verifCode.trim()) {
      setError("Le code de vérification est requis.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true); // 🚀 On démarre le chargement

    try {
      console.log("Envoi du code : ", verifCode); // 📋 Pour debug
      const response = await axios.patch("http://localhost:5000/auth/validation", { verifCode });

      setMessage(response.data?.message || "Validation réussie !");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la validation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Vérification de l'email</h2>

        <p className="text-gray-600 text-center mb-2">
          Un message a été envoyé sur votre boîte email. Veuillez entrer le code reçu pour finaliser l'inscription.
        </p>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleValidation} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Entrez le code de vérification"
            value={verifCode}
            onChange={(e) => setVerifCode(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? "Validation..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailValidation;
