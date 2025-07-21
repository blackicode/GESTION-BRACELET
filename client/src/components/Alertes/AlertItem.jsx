import React from 'react';
import axios from 'axios';

const AlertItem = ({ alert }) => {
  const handleResolve = async () => {
    try {
      await axios.patch(`http://localhost:5000/alertes/${alert._id}`);
      alert("Alerte résolue !");
    } catch (err) {
      alert("Erreur lors de la résolution.");
    }
  };

  return (
    <div className="border p-4 my-2 bg-gray-100">
      <p><strong>Type maladie :</strong> {alert.typeMaladie}</p>
      <p><strong>Message :</strong> {alert.message}</p>
      <p><strong>Seuil :</strong> {alert.seuilDepasse}</p>
      <p><strong>Statut :</strong> {alert.resolved ? "Résolue" : "Active"}</p>
      {!alert.resolved && (
        <button onClick={handleResolve} className="mt-2 bg-green-500 text-white px-3 py-1">
          Marquer comme résolue
        </button>
      )}
    </div>
  );
};

export default AlertItem;
