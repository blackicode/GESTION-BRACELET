import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import { useForgotPasswordMutation } from '../../api/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate(); // Créer une instance de navigate
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword({ email }).unwrap();
      if (result && typeof result === 'object') {
        setMessage('Un email de réinitialisation a été envoyé.');
        navigate("/validatecode"); // Rediriger vers la page de validation
      }
    } catch (error) {
      console.error('Échec de la réinitialisation du mot de passe', error);
      if (error.originalStatus === 404) {
        setMessage('L\'endpoint de réinitialisation du mot de passe est introuvable.');
      } else {
        setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez entrer un bon e-mail');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-slate-100">
      <div className="max-w-lg space-y-2 bg-white px-10 py-8 rounded-xl shadow">
        <h1 className="text-center text-3xl font-bold">Récupération du mot de passe</h1>
        <form onSubmit={handleSubmit} className="mt-8">
          <input
            className="border border-blue-400 rounded mb-4 p-2 w-full outline-blue-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 mt-4 px-4 rounded">
            Récupérer
          </button>
        </form>
        {message && <p className="text-red-400">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
