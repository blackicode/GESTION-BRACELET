import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationChecker = ({ patientId }) => {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkNotification = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/notifications/patient/${patientId}`);
        if (res.data.statut === 'approuve') {
          setNotification('Un médecin vous a été attribué.');
          navigate(`/patient-dashboard/${patientId}`);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la notification:', err.response?.data || err.message);
      }
    };

    const interval = setInterval(checkNotification, 5000);
    checkNotification();

    return () => clearInterval(interval);
  }, [patientId, navigate]);

  return (
    <div className="notification-checker">
      {notification || 'En attente de l’approbation d’un médecin...'}
    </div>
  );
};

export default NotificationChecker;