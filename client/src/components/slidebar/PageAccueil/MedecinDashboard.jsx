import React from "react";

const MedecinDashboard = ({ user }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenue Dr. {user.firstName} {user.lastName}</h1>
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profil"
          className="w-32 h-32 rounded-full border"
        />
        <div>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Spécialité :</strong> {user.specialite || "Non renseignée"}</p>
          <p><strong>Téléphone :</strong> {user.phone || "Non renseigné"}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Activités récentes</h2>
        <p>(à personnaliser avec l’activité médicale liée à l’utilisateur)</p>
      </div>
    </div>
  );
};

export default MedecinDashboard;
