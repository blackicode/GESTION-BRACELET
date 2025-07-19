import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // Type d'utilisateur (fixé automatiquement à "Patient")
    userType: {
      type: String,
      default: "Patient",
      enum: ["Patient"],
      required: true,
    },

    // Informations personnelles
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: "" },

    // Infos spécifiques au patient
    langueLocale: {
      type: String,
      enum: ["malinke", "soussou", "peulh"],
      required: true,
    },
    typeMaladie: {
      type: String,
      enum: ["diabète", "grossesse", "tension"],
      required: true,
    },

    // Bracelet connecté
    braceletId: {
      type: String,
      required: true,
      unique: true,
    },

    // Vérification OTP
    verifCode: { type: Number },
    verifCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },

    // Carte patient numérique
    qrCodeData: { type: String }, // Données encodées dans un QR Code
    registrationDate: { type: Date, default: Date.now },

    // Sécurité
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
