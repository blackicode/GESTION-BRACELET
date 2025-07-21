import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import imageLogin from "/src/assets/images/Login.png";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Vous devez entrer un email valide")
    .required("L'email est obligatoire"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est obligatoire"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [login, { isLoading, isSuccess, isError, error, data }] = useLoginMutation();
  const [lockTime, setLockTime] = useState(0);

  useEffect(() => {
    if (lockTime > 0) {
      const timer = setTimeout(() => setLockTime(lockTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockTime]);

  useEffect(() => {
    if (isSuccess && data) {
      localStorage.setItem("user", JSON.stringify(data)); // stocke tout l'utilisateur
  
      // Rediriger selon le type d'utilisateur
      if (data.userType === "Administrateur") {
        navigate("/admin/dashboard");
      } else if (data.userType === "Medecin") {
        navigate("/medecin/dashboard");
      } 
    }
  }, [isSuccess, navigate, data]);
  

  const onSubmit = async (formData) => {
    if (lockTime > 0) return;

    try {
      const response = await login(formData);
      if (response.error?.data?.lockTime) {
        setLockTime(response.error.data.lockTime);
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
    }
  };

  return (
    <div className="md:grid md:grid-cols-2 items-center w-full min-h-screen">
      <div className="pr-4 border-r-2 border-blue-500">
        <img src={imageLogin} alt="Login" />
      </div>
      <div className="px-8 space-y-8">
        <h1 className="text-3xl font-bold">Se connecter</h1>
        {lockTime > 0 && (
          <p className="text-red-500 text-center mb-4">
            Réessayez dans {lockTime} secondes
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email")}
              className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              {...register("password")}
              className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Mot de passe"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {isError && <p className="text-red-500">{error?.data?.message || "Identifiants invalides"}</p>}

          <div className="text-center mt-4">
            <button
              type="submit"
              className={`${isLoading ? "bg-blue-100 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded-md transition duration-300 ease-in-out`}
              disabled={isLoading || lockTime > 0}
            >
              {isLoading || lockTime > 0 ? (
                <>
                  <span className="mr-2">Connexion...</span>
                  <FontAwesomeIcon icon={faSpinner} spin />
                </>
              ) : (
                "Se connecter"
              )}
            </button>
            <p className="mt-4">
              <Link to="/forgot-password" className="text-blue-500 font-bold">
                Mot de passe oublié ?
              </Link>
            </p>
            <p className="mt-2 text-gray-600">
              Vous n'avez pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-500 hover:underline transition duration-300 ease-in-out">
                Créez-en un !
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
