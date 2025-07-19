// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { useLoginMutation } from "../../api/auth";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import imageLogin from "/src/assets/images/Login.png";

// const schema = yup.object().shape({
//   userType: yup.string().required("Vous devez sélectionner votre statut"),
//   email: yup
//     .string()
//     .email("Vous devez entrer un email valide")
//     .required("L'email est obligatoire"),
//   password: yup
//     .string()
//     .min(8, "Le mot de passe doit contenir au moins 8 caractères")
//     .required("Le mot de passe est obligatoire"),
// });

// export default function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const navigate = useNavigate();
//   const [login, { isLoading, isSuccess, isError, error, data }] = useLoginMutation();
//   const [lockTime, setLockTime] = useState(0);

//   useEffect(() => {
//     if (lockTime > 0) {
//       const timer = setTimeout(() => setLockTime(lockTime - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [lockTime]);

//   useEffect(() => {
//     if (isSuccess && data) {
//       localStorage.setItem("user", JSON.stringify(data));
//       console.log("Connexion réussie :", data);
//       navigate("/dashboard");
//     }
//   }, [isSuccess, navigate, data]);

//   const onSubmit = async (formData) => {
//     if (lockTime > 0) return;

//     try {
//       const response = await login(formData);
//       if (response.error?.data?.lockTime) {
//         setLockTime(response.error.data.lockTime);
//       }
//     } catch (err) {
//       console.error("Erreur lors de la connexion :", err);
//     }
//   };

//   return (
//     <div className="md:grid md:grid-cols-2 items-center w-full min-h-screen">
//       <div className="pr-4 border-r-2 border-blue-500">
//         <img src={imageLogin} alt="Login" />
//       </div>
//       <div className="px-8 space-y-8">
//         <h1 className="text-3xl font-bold">Se connecter</h1>
//         {lockTime > 0 && (
//           <p className="text-red-500 text-center mb-4">
//             Réessayez dans {lockTime} secondes
//           </p>
//         )}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
//             <select
//               {...register("userType")}
//               className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">-- Sélectionnez --</option>
//               <option value="Student">Étudiant</option>
//               <option value="Professor">Professeur</option>
//             </select>
//             {errors.userType && <p className="text-red-500">{errors.userType.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               {...register("email")}
//               className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               type="email"
//               placeholder="Email"
//             />
//             {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
//             <input
//               {...register("password")}
//               className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               type="password"
//               placeholder="Mot de passe"
//             />
//             {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//           </div>

//           {isError && <p className="text-red-500">{error?.data?.message || "Identifiants invalides"}</p>}

//           <div className="text-center mt-4">
//             <button
//               type="submit"
//               className={`${isLoading ? "bg-blue-100 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
//                 } text-white px-4 py-2 rounded-md transition duration-300 ease-in-out`}
//               disabled={isLoading || lockTime > 0}
//             >
//               {isLoading || lockTime > 0 ? (
//                 <>
//                   <span className="mr-2">Connexion...</span>
//                   <FontAwesomeIcon icon={faSpinner} spin />
//                 </>
//               ) : (
//                 "Se connecter"
//               )}
//             </button>
//             <p className="mt-4">
//               <Link to="/forgot-password" className="text-blue-500 font-bold">
//                 Mot de passe oublié ?
//               </Link>
//             </p>
//             <p className="mt-2 text-gray-600">
//               Vous n'avez pas encore de compte ?{" "}
//               <Link to="/register" className="text-blue-500 hover:underline transition duration-300 ease-in-out">
//                 Créez-en un !
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // pour redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      setMessage(response.data.message);

      // Si connexion réussie, redirection vers Dashboard
      if (response.status === 200) {
        // Tu peux aussi stocker un token ici avec localStorage si nécessaire
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // délai court pour afficher le message avant la redirection
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message, lockTime } = error.response.data;
        setMessage(`${message} ${lockTime ? `(Temps restant: ${lockTime}s)` : ""}`);
      } else {
        setMessage("Erreur lors de la tentative de connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

