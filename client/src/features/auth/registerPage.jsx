import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userType: "Patient",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    photo: "",
    langueLocale: "",
    typeMaladie: "",
    braceletId: "",
    specialite: "",
    otpMethod: "sms",
    provider: "", // Pour le paiement mobile
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setFormData({
      ...formData,
      userType: e.target.value,
      // réinitialiser les champs spécifiques
      langueLocale: "",
      typeMaladie: "",
      braceletId: "",
      specialite: "",
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result, // base64
      }));
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const dataToSend = { ...formData };

    // Supprimer les champs inutiles en fonction du type d'utilisateur
    if (dataToSend.userType !== "Medecin") {
      delete dataToSend.specialite;
    }
    if (dataToSend.userType !== "Patient") {
      delete dataToSend.langueLocale;
      delete dataToSend.typeMaladie;
      delete dataToSend.braceletId;
      delete dataToSend.phone;
      delete dataToSend.provider;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", dataToSend, {
        withCredentials: true,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data || "Erreur lors de l’inscription");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-red-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type d'utilisateur */}
        <div>
          <label className="block font-medium">Type d'utilisateur</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleUserTypeChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Patient">Patient</option>
            <option value="Medecin">Médecin</option>
            <option value="Administrateur">Administrateur</option>
          </select>
        </div>

        {/* Champs communs */}
        <input name="firstName" onChange={handleChange} value={formData.firstName} className="w-full border rounded px-3 py-2" placeholder="Prénom" required />
        <input name="lastName" onChange={handleChange} value={formData.lastName} className="w-full border rounded px-3 py-2" placeholder="Nom" required />
        <input name="email" onChange={handleChange} value={formData.email} type="email" className="w-full border rounded px-3 py-2" placeholder="Email" required />
        <input name="password" onChange={handleChange} value={formData.password} type="password" className="w-full border rounded px-3 py-2" placeholder="Mot de passe" required />

        {/* Photo */}
        <div>
          <label className="block font-medium mb-1">Photo de profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Champs Patient */}
        {formData.userType === "Patient" && (
          <>
            <input name="phone" onChange={handleChange} value={formData.phone} className="w-full border rounded px-3 py-2" placeholder="Téléphone" required />
            <select name="langueLocale" onChange={handleChange} value={formData.langueLocale} className="w-full border rounded px-3 py-2" required>
              <option value="">Langue locale</option>
              <option value="malinke">Malinké</option>
              <option value="soussou">Soussou</option>
              <option value="peulh">Peulh</option>
            </select>
            <select name="typeMaladie" onChange={handleChange} value={formData.typeMaladie} className="w-full border rounded px-3 py-2" required>
              <option value="">Type de maladie</option>
              <option value="diabète">Diabète</option>
              <option value="grossesse">Grossesse</option>
              <option value="tension">Tension</option>
            </select>
            <input name="braceletId" onChange={handleChange} value={formData.braceletId} className="w-full border rounded px-3 py-2" placeholder="ID Bracelet" required />
            <select
              name="provider"
              onChange={handleChange}
              value={formData.provider}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Choisissez un opérateur --</option>
              <option value="Orange">Orange</option>
              <option value="MTN">MTN</option>
            </select>
          </>
        )}

        {/* Champs Médecin */}
        {formData.userType === "Medecin" && (
          <select name="specialite" onChange={handleChange} value={formData.specialite} className="w-full border rounded px-3 py-2" required>
            <option value="">Spécialité</option>
            <option value="diabète">Diabète</option>
            <option value="grossesse">Grossesse</option>
            <option value="tension">Tension</option>
          </select>
        )}

        {/* Méthode OTP */}
        <div>
          <label className="block font-medium">Méthode de vérification</label>
          <select
            name="otpMethod"
            value={formData.otpMethod}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
