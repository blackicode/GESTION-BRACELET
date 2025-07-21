import React, { useState } from 'react';
import axios from 'axios';

const AlertForm = () => {
  const [form, setForm] = useState({
    patientId: '',
    sensorData: {
      glycemie: '',
      tensionSystolique: '',
      temperature: '',
      rythmeCardiaque: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/alertes', form);
      alert(res.data.message);
    } catch (err) {
      alert("Erreur lors de la création de l'alerte.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input type="text" placeholder="Patient ID" className="border p-2 w-full"
        onChange={e => setForm({ ...form, patientId: e.target.value })} />

      <input type="number" placeholder="Glycémie" className="border p-2 w-full"
        onChange={e => setForm({ ...form, sensorData: { ...form.sensorData, glycemie: parseFloat(e.target.value) } })} />

      <input type="number" placeholder="Tension Systolique" className="border p-2 w-full"
        onChange={e => setForm({ ...form, sensorData: { ...form.sensorData, tensionSystolique: parseFloat(e.target.value) } })} />

      <input type="number" placeholder="Température (°C)" className="border p-2 w-full"
        onChange={e => setForm({ ...form, sensorData: { ...form.sensorData, temperature: parseFloat(e.target.value) } })} />

      <input type="number" placeholder="Rythme cardiaque (bpm)" className="border p-2 w-full"
        onChange={e => setForm({ ...form, sensorData: { ...form.sensorData, rythmeCardiaque: parseFloat(e.target.value) } })} />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Envoyer alerte</button>
    </form>
  );
};

export default AlertForm;
