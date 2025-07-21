import React, { useState } from 'react';
import AlertForm from './AlertForm';
import AlertList from './AlertList';

function App() {
  const [patientId, setPatientId] = useState('');

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Système d’Alerte Médicale</h1>
      <AlertForm />
      <div className="mt-8">
        <input
          type="text"
          placeholder="Patient ID pour voir les alertes"
          className="border p-2 w-full mb-2"
          onChange={(e) => setPatientId(e.target.value)}
        />
        {patientId && <AlertList patientId={patientId} />}
      </div>
    </div>
  );
}

export default App;
