import mongoose from 'mongoose';

// Définition du schéma de la collection "notifications"
const notificationSchema = new mongoose.Schema({
  // Patient concerné par la notification
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Émetteur de la notification (médecin, infirmier, etc.)
  emetteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Type de notification : médicament ou rendez-vous
  type: {
    type: String,
    enum: ['medicament', 'rendez-vous'],
    required: true
  },

  // Contenu du message (texte)
  message: {
    type: String,
    required: true
  },

  // Lien vers fichier audio associé (ex. : synthèse vocale)
  audioUrl: {
    type: String
  },

  // Pour les rendez-vous : horaire concerné
  horaireRdv: {
    type: Date
  },

  // Réponse du médecin au rendez-vous
  reponseMedecin: {
    maintien: { type: Boolean, default: null },
    nouvelleDate: { type: Date, default: null },
    repondu: { type: Boolean, default: false }
  },

  // Réponse du patient au rendez-vous
  reponsePatient: {
    maintien: { type: Boolean, default: null },
    nouvelleDate: { type: Date, default: null },
    repondu: { type: Boolean, default: false }
  },

  // Marquage de la notification comme lue ou non
  lu: {
    type: Boolean,
    default: false
  },

  // Date d’envoi explicite (optionnel, redondant avec createdAt)
  dateEnvoi: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Création du modèle à partir du schéma
const Notification = mongoose.model('NotificationAlerte', notificationSchema);

export default Notification;
