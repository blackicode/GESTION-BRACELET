// import React, { useState } from 'react';
// import { validateCode } from '../../api/auth'; // Assurez-vous d'importer la fonction validateCode
// import { useNavigate } from 'react-router-dom'; // Importez useNavigate

// function ValidateCode() {
//     const [email, setEmail] = useState('');
//     const [verifCode, setVerifCode] = useState('');
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate(); // Initialisez useNavigate

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const result = await validateCode({ email, verifCode });
//             setMessage(result.message);

//             // Redirection vers le tableau de bord si le code est validé
//             if (result.success) { // Assurez-vous que votre API renvoie un champ success
//                 navigate('/dashboard'); // Changez '/dashboard' par le chemin de votre tableau de bord
//             }
//         } catch (error) {
//             setMessage('Erreur lors de la validation du code.');
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md w-96">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Valider le Code</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Entrez votre email"
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="verifCode" className="block text-sm font-medium text-gray-700">Code de vérification</label>
//                         <input
//                             type="text"
//                             id="verifCode"
//                             value={verifCode}
//                             onChange={(e) => setVerifCode(e.target.value)}
//                             placeholder="Entrez le code de vérification"
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition duration-200"
//                     >
//                         Valider le code
//                     </button>
//                 </form>
//                 {message && <p className="mt-4 text-center text-red-600">{message}</p>}
//             </div>
//         </div>
//     );
// }

// export default ValidateCode;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ValidateCode() {
    const [email, setEmail] = useState('');
    const [verifCode, setVerifCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch("http://localhost:5000/validatecode", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, verifCode }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message);
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Erreur lors de la validation du code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Valider le Code</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez votre email"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="verifCode" className="block text-sm font-medium text-gray-700">Code de vérification</label>
                        <input
                            type="text"
                            id="verifCode"
                            value={verifCode}
                            onChange={(e) => setVerifCode(e.target.value)}
                            placeholder="Entrez le code"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Validation en cours...' : 'Valider le code'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-600">{message}</p>}
            </div>
        </div>
    );
}

export default ValidateCode;
