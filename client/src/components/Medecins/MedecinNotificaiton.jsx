import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedecinNotifications = ({ medecinId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/notifications/medecin/${medecinId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [medecinId]);

  const handleApprove = async (notificationId, patientId) => {
    try {
      await axios.post('http://localhost:5000/notifications/approuver', {
        notificationId,
        medecinId,
        patientId,
      });
      setNotifications(notifications.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error('Erreur lors de l’approbation:', error.response?.data || error.message);
    }
  };

  if (loading) return <p>Chargement des notifications...</p>;
  if (notifications.length === 0) return <p>Aucune notification en attente.</p>;

  return (
    <div className="medecin-notifications">
      <h2>Notifications pour le médecin</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>
            <p>
              Nouveau patient: <strong>{notif.patientId?.firstName} {notif.patientId?.lastName}</strong> ({notif.specialite})
            </p>
            <button onClick={() => handleApprove(notif._id, notif.patientId._id)}>
              Approuver ce patient
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedecinNotifications;