

// // export default MesPatients;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MesPatients = () => {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState("day");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [error, setError] = useState("");

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `http://localhost:5000/patient/mespatients?filterType=${filterType}&date=${date}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPatients(response.data);
//     } catch (err) {
//       console.error("Erreur de chargement des patients :", err);
//       setError("Impossible de charger les patients.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, [filterType, date]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">📋 Mes Patients</h2>

//       <div className="flex items-center gap-4 mb-6">
//         <select
//           className="border rounded px-3 py-2"
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//         >
//           <option value="day">Aujourd’hui</option>
//           <option value="month">Ce mois</option>
//           <option value="year">Cette année</option>
//         </select>

//         <input
//           type="date"
//           className="border rounded px-3 py-2"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <p className="text-blue-600">Chargement en cours...</p>
//       ) : error ? (
//         <p className="text-red-600">{error}</p>
//       ) : patients.length === 0 ? (
//         <p className="text-gray-500">Aucun patient trouvé.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="py-2 px-4 border">Nom</th>
//                 <th className="py-2 px-4 border">Prénom</th>
//                 <th className="py-2 px-4 border">Email</th>
//                 <th className="py-2 px-4 border">Téléphone</th>
//                 <th className="py-2 px-4 border">Date d'ajout</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.map((patient) => (
//                 <tr key={patient._id}>
//                   <td className="py-2 px-4 border">{patient.lastName}</td>
//                   <td className="py-2 px-4 border">{patient.firstName}</td>
//                   <td className="py-2 px-4 border">{patient.email}</td>
//                   <td className="py-2 px-4 border">{patient.phone}</td>
//                   <td className="py-2 px-4 border">
//                     {new Date(patient.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MesPatients;





import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MesPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filterType, setFilterType] = useState("day");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Veuillez vous connecter.");
      }

      const response = await axios.get(
        `http://localhost:5000/patient/mespatients`,
        {
          params: { filterType, date, page },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(response.data.patients || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      if (error.message === "Veuillez vous connecter.") {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMessage = error.response?.data?.message || "Erreur de chargement des patients.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [filterType, date, page, navigate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPage(1); // Reset page to 1 when filter changes
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setPage(1); // Reset page to 1 when date changes
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mes patients par spécialité</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Filtrer par :</label>
          <select
            className="border rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="day">Jour</option>
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
            <option value="year">Année</option>
          </select>
        </div>

        <input
          type="date"
          className="border rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={handleDateChange}
        />

        <button
          onClick={fetchPatients}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Chargement..." : "Rafraîchir"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : patients.length === 0 ? (
        <p className="text-gray-600 text-center">Aucun patient trouvé.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left font-semibold">Nom</th>
                  <th className="p-3 text-left font-semibold">Numéro de Bracelet</th>
                  <th className="p-3 text-left font-semibold">Téléphone</th>
                  <th className="p-3 text-left font-semibold">Date d’arrivée</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border-t">
                      <div className="flex items-center gap-2">
                        {patient.photo && (
                          <img
                            src={patient.photo}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback image
                          />
                        )}
                        <Link
                          to={`/dashboard/patientprofile/${patient._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {patient.firstName} {patient.lastName}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 border-t">{patient.braceletId || "N/A"}</td>
                    <td className="p-3 border-t">{patient.phone || "N/A"}</td>
                    <td className="p-3 border-t">
                      {new Date(patient.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                page === 1 || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Précédent
            </button>
            <span className="text-gray-700">
              Page {page} sur {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                page === totalPages || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MesPatients;