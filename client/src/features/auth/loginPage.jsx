import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../api/auth"; // ton hook RTK Query
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import imageLogin from "/src/assets/images/Login.png";

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("L'email est obligatoire"),
  password: yup.string().min(6, "Mot de passe trop court").required("Le mot de passe est obligatoire"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
      localStorage.setItem("user", JSON.stringify(data));
      if (data.id) localStorage.setItem("id", data.id);

      // ✅ Sauvegarde du token pour l'authentification
    if (data.token) {
      localStorage.setItem("token", data.token);
    } else {
      console.warn("Token non présent dans la réponse");
    }

      switch (data.userType) {
        case "Administrateur":
          navigate("/dashboard/admindashboard");
          break;
        case "Medecin":
          navigate(`/dashboard/medecindashboard/${data.id}`);
          break;
        
      }
    }
  }, [isSuccess, data, navigate]);

  const onSubmit = async (formData) => {
    if (lockTime > 0) return;
    try {
      // await login(formData);

      await login({ ...formData, platform: "web" });

    } catch (err) {
      console.error("Erreur de connexion :", err);
    }
  };

  return (
    <div className="md:grid md:grid-cols-2 items-center w-full min-h-screen">
      <div className="pr-4 border-r-2 border-blue-500">
        <img src={imageLogin} alt="Illustration connexion" />
      </div>

      <div className="px-8 space-y-8">
        <h1 className="text-3xl font-bold">Se connecter</h1>

        {lockTime > 0 && (
          <p className="text-red-500 text-center">Réessayez dans {lockTime} secondes</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Mot de passe"
              className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {isError && (
            <p className="text-red-500">{error?.data?.message || "Identifiants incorrects"}</p>
          )}

          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isLoading || lockTime > 0}
              className={`${
                isLoading || lockTime > 0
                  ? "bg-blue-100 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded-md transition`}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Connexion...</span>
                  <FontAwesomeIcon icon={faSpinner} spin />
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

          <p className="text-center mt-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Mot de passe oublié ?
            </Link>
          </p>
          <p className="text-center text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Créez-en un !
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
