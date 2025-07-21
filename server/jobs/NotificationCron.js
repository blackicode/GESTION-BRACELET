import cron from 'node-cron';
import Notification from '../models/Alertes/Notification.js';  // adapte le chemin
import User from '../models/User.js';
import { sendNotificationToPatient, sendNotificationToMedecin } from '../controllers/Alertes/Notification.js'; // fonction fictive d’envoi

// Cron job pour envoyer un rappel toutes les 24h aux patients (notifications rendez-vous non confirmées)
// Ici on cible les notifications rendez-vous qui ne sont pas encore lues ou confirmées
cron.schedule('0 9 * * *', async () => {
  // Tous les jours à 09h00 (heure du serveur)
  console.log("Lancement du cron job 24h rappel rendez-vous");

  const maintenant = new Date();

  // On cible les notifications rendez-vous qui n'ont pas reçu de réponse patient ou médecin
  const notifications = await Notification.find({
    type: 'rendez-vous',
    'reponsePatient.repondu': false,
    'reponseMedecin.repondu': false,
    horaireRdv: { $gte: maintenant }
  });

  for (const notif of notifications) {
    const patient = await User.findById(notif.patientId);
    const medecin = await User.findById(notif.emetteurId);

    // Exemple d’envoi à patient et médecin (implémenter la fonction sendNotificationToPatient selon ton besoin)
    await sendNotificationToPatient(patient, notif);
    await sendNotificationToMedecin(medecin, notif);

    console.log(`Rappel 24h envoyé pour notification ID ${notif._id}`);
  }
});

// Cron job pour rappel 1 heure avant rendez-vous
cron.schedule('0 * * * *', async () => {
  // Toutes les heures pile, on regarde les rendez-vous à moins d’1h
  console.log("Lancement du cron job 1h avant rappel");

  const maintenant = new Date();
  const heurePlusTard = new Date(maintenant.getTime() + 60 * 60 * 1000);

  // On cherche les notifications rendez-vous dont horaireRdv est entre maintenant et +1h
  const notifications = await Notification.find({
    type: 'rendez-vous',
    horaireRdv: { $gte: maintenant, $lte: heurePlusTard },
    'reponsePatient.repondu': false
  });

  for (const notif of notifications) {
    const patient = await User.findById(notif.patientId);
    const medecin = await User.findById(notif.emetteurId);

    await sendNotificationToPatient(patient, notif);
    await sendNotificationToMedecin(medecin, notif);

    console.log(`Rappel 1h avant envoyé pour notification ID ${notif._id}`);
  }
});

console.log('Cron jobs programmés');
