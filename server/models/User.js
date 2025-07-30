// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   userType: {
//     type: String,
//     required: true,
//     enum: ["Patient", "Medecin", "Administrateur"],
//   },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   photo: { type: String, default: "" },

//   // Champs spécifiques au patient
//   langueLocale: {
//     type: String,
//     enum: ["malinke", "soussou", "peulh"],
//   },
//   typeMaladie: {
//     type: String,
//     enum: ["diabète", "grossesse", "tension"],
//   },

//   // Champs spécifiques au médecin
//   specialite: {
//     type: String,
//     enum: ["diabète", "grossesse", "tension"],
//   },

//   // Admin : pas de champ particulier pour l'instant

//   verifCode: { type: Number },
//   isVerified: { type: Boolean, default: false },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   failedAttempts: { type: Number, default: 0 },
//   lockUntil: { type: Date, default: null },
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);
// // Note: This schema defines a User model with fields for user type, personal information, and specific fields for patients and doctors.
// // The userType field determines the role of the user, and the schema includes validation for specific fields based on the user type.
// // The schema also includes fields for verification, password reset, and security features like failed login attempts and account locking.





import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  userType: {
    type: String,
    required: true,
    enum: ["Patient", "Medecin", "Administrateur"],
  },

  // Informations personnelles
  firstName: { type: String, required: false },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: function () { return this.userType === "Patient"; }, unique: false },
  password: { type: String, required: true },
  photo: { type: String, default: "" },

  // Champs spécifiques au Patient
  langueLocale: {
    type: String,
    enum: ["malinke", "soussou", "peulh"],
    required: function () { return this.userType === "Patient"; },
  },
  typeMaladie: {
    type: String,
    enum: ["diabète", "grossesse", "tension"],
    required: function () { return this.userType === "Patient"; },
  },
  braceletId: {
    type: String,
    required: function () { return this.userType === "Patient"; },
    // unique: function () { return this.userType === "Patient"; },
  },
  qrCodeData: { type: String },

  // Champs spécifiques au Médecin
  specialite: {
    type: String,
    enum: ["diabète", "grossesse", "tension"],
    required: function () { return this.userType === "Medecin"; },
  },

  // Vérification OTP
  verifCode: { type: Number },
  verifCodeExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // Sécurité
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  // Date d'inscription
  registrationDate: { type: Date, default: Date.now },
}, { timestamps: true });

// ✅ Index unique uniquement si braceletId est défini et non null
userSchema.index(
  { braceletId: 1 },
  { unique: true, partialFilterExpression: { braceletId: { $exists: true, $ne: null } } }
);

const User = mongoose.model("User", userSchema);
export default User;




