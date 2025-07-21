

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import imageRegister from "/src/assets/images/Signup.png";

// Schéma de validation Yup
const schema = yup.object().shape({
  userType: yup
  .string()
  // .oneOf(["Medecin", "Administrateur"], "Veuillez sélectionner un type d'utilisateur")
  .required("Veuillez sélectionner un type d'utilisateur"),
  firstName: yup.string().required("Le prénom est obligatoire"),
  lastName: yup.string().required("Le nom de famille est obligatoire"),
  email: yup
    .string()
    .email("Veuillez entrer une adresse e-mail valide")
    .required("L'e-mail est obligatoire"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est obligatoire"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Les mots de passe doivent correspondre")
    .required("La confirmation du mot de passe est obligatoire"),
  
  
  // Specialité uniquement pour les médecins
  specialite: yup.mixed().when('userType', {
    is: (val) => val === 'Medecin',
    then: () =>
      yup
        .string()
        .oneOf(['diabète', 'grossesse', 'tension'], 'Spécialité invalide')
        .required('Veuillez sélectionner une spécialité'),
    otherwise: () => yup.string().notRequired(),
  }),
  
  photo: yup.mixed().required("La photo de profil est obligatoire"),
  
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    specialite,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: false, // ← très important ici !
  });
  const [previewImage, setPreviewImage] = useState("");


  const navigate = useNavigate();
  const [registerUser, { isLoading, isSuccess, isError, error, data }] = useRegisterMutation();
  const userType = watch("userType");

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/validation");
    }
  }, [isSuccess, navigate, data]);

  const onSubmit = (formData) => {
    // Conversion de la photo en base64 avant l'envoi
    const preparedData = {
      ...formData,
      photo: formData.photo || "", // Assurez-vous que la photo est bien gérée côté serveur
    };
    registerUser(preparedData); // Utilisation des données préparées
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setValue("photo", base64, { shouldValidate: true });
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };
  
  

  return (
    <div className="md:grid md:grid-cols-2 items-center w-full min-h-screen">
      {/* Section Image */}
      <div className="pr-4 border-r-2 border-blue-500">
        <img className="max-w-full h-auto" src={imageRegister} alt="Illustration d'inscription" />
      </div>

      {/* Section Formulaire */}
      <div className="px-8 space-y-8">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type d'utilisateur */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
            <select
              {...register("userType")}
              className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="Medecin">Médecin</option>
              <option value="Administrateur">Administrateur</option>

            </select>
            {errors.userType && <p className="text-red-500">{errors.userType.message}</p>}
          </div>

          {/* Champs conditionnels */}
          {userType === "Medecin" && (
            <>
              {/* Prénom */}
              <div className="space-y-2">

                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  {...register("firstName")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Prénom"
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom de famille</label>
                <input
                  {...register("lastName")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Nom de famille"
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  {...register("email")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  {...register("password")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  placeholder="Mot de passe"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
                <input
                  {...register("confirmPassword")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  placeholder="Confirmation du mot de passe"
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                <select
                  {...register("specialite")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                  <option value="">-- Choisir une spécialité --</option>
                  <option value="diabète">Diabète</option>
                  <option value="grossesse">Grossesse</option>
                  <option value="tension">Tension</option>
                </select>
                {errors.specialite && <p className="text-red-500">{errors.specialite.message}</p>}
              </div>
              <div>
                <label htmlFor="photoInput" className="block mb-4 cursor-pointer text-blue-600">
                <img
                  src={previewImage || "/default-profile.png"} // chemin d’une image par défaut si tu veux
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300"
                />

                  <span>Changer la photo de profil</span>
                </label>
                <input
                  type="file"
                  id="photoInput"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <input type="hidden" {...register("photo")} />

                {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

              </div>
            
            </>
          )}

          {userType === "Administrateur" && (
            <>
              {/* Prénom */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  {...register("firstName")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Prénom"
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom de famille</label>
                <input
                  {...register("lastName")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Nom de famille"
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  {...register("email")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  {...register("password")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  placeholder="Mot de passe"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
                <input
                  {...register("confirmPassword")}
                  className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  placeholder="Confirmation du mot de passe"
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div>
                <label htmlFor="photoInput" className="block mb-4 cursor-pointer text-blue-600">
                  <img
                    src="./src/assets/images/logo.PNG"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />

                </label>
                <input
                  type="file"
                  id="photoInput"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

              </div>
            </>
          )}

          {/* Affichage des erreurs API */}
          {isError && <p className="text-red-500">Erreur : {error?.data?.message || "Une erreur est survenue."}</p>}


          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${isLoading ? "bg-blue-100 cursor-not-allowed" : "bg-blue-500"
              } text-blue-50 px-4 py-2 rounded-md w-full`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Enregistrement en cours...
              </span>
            ) : (
              "S'inscrire"
            )}
          </button>

          <p className="mt-2 text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-500 hover:underline transition">
              Connectez-vous !
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
