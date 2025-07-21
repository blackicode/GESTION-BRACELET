import React from "react";

const AdminDashboard = ({ user }) => {
  if (!user) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Erreur : Les informations de l'utilisateur ne sont pas disponibles.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue Administrateur {user.firstName} {user.lastName}
      </h1>
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profil"
          className="w-32 h-32 rounded-full border"
        />
        <div>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> Administrateur système</p>
          <p><strong>Téléphone :</strong> {user.phone || "Non renseigné"}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Tableau de bord</h2>
        <ul className="list-disc ml-6">
          <li>Gestion des utilisateurs</li>
          <li>Suivi des alertes médicales</li>
          <li>Paramétrage des modules</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
