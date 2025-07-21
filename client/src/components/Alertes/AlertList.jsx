import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertItem from './AlertItem';

const AlertList = ({ patientId }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/alertes/${patientId}`);
        setAlerts(res.data);
      } catch (err) {
        console.error("Erreur de récupération des alertes");
      }
    };
    if (patientId) fetchAlerts();
  }, [patientId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Alertes du patient</h2>
      {alerts.map(alert => (
        <AlertItem key={alert._id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertList;
