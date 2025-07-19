import React from "react";

const Verification = ({ otpCode, setOtpCode, handleVerifyOtp, otpMethod }) => {
  return (
    <div className="space-y-3">
      <p>Un code a été envoyé par {otpMethod}. Entrez-le ci-dessous :</p>
      <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full border p-2 rounded" />
      <button onClick={handleVerifyOtp} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Vérifier</button>
    </div>
  );
};

export default Verification;