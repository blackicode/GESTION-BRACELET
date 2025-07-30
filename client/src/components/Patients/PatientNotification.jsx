import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = ({ patientId }) => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientAndDoctorInfo = async () => {
      try {
        const notificationRes = await axios.get(`http://localhost:5000/notifications/patient/${patientId}`);
        if (notificationRes.data.statut === 'approuve') {
          setPatientInfo(notificationRes.data.patientId);
          setDoctorInfo(notificationRes.data.approuvePar);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientAndDoctorInfo();
  }, [patientId]);

  const handleAppointment = async () => {
    try {
      // Placeholder for appointment scheduling logic
      console.log('Prendre rendez-vous avec', doctorInfo);
      alert('Rendez-vous demandé. Fonctionnalité à implémenter.');
    } catch (error) {
      console.error('Erreur lors de la prise de rendez-vous:', error.response?.data || error.message);
    }
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (!patientInfo || !doctorInfo) return <p>Informations non disponibles.</p>;

  return (
    <div className="patient-dashboard">
      <h2>Bienvenue, {patientInfo.firstName} {patientInfo.lastName}</h2>
      <h3>Votre médecin attribué</h3>
      <p>Nom: {doctorInfo.firstName} {doctorInfo.lastName}</p>
      <p>Spécialité: {doctorInfo.specialite}</p>
      <p>Email: {doctorInfo.email}</p>
      <button onClick={handleAppointment}>Prendre un rendez-vous</button>
    </div>
  );
};

export default PatientDashboard;