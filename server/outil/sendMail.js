// import nodemailer from "nodemailer";

// const sendMail = async (user, resetToken, verifCode) => {
//   try {
//     // Configuration du transporteur
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,  // Ex. 'smtp.gmail.com'
//       port: Number(process.env.EMAIL_PORT),  // Ex. 587
//       // secure: Boolean(process.env.SECURE), 
//       secure: process.env.SECURE === "true", // True pour les connexions sécurisées (SSL)
//       auth: {
//         user: process.env.EMAIL_USER,  // Ex. 'votre.email@gmail.com'
//         pass: process.env.EMAIL_PASS,  // Ex. 'motdepasse'
//       },
//     });

//     // Création du lien de réinitialisation
//     const resetURL = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;

//     // Création du message d'email
//     const message = {
//       from: process.env.EMAIL_USER,
//       to: user.email,  // Adresse email du destinataire
//       subject: 'Réinitialisation du mot de passe',
//       text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetURL}`,
//       html: `
//         <h3>Réinitialisation du mot de passe</h3>
//         <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
//         <a href="${resetURL}">Réinitialiser le mot de passe</a>
//         <p>Ou utilisez ce code de vérification : <strong>${verifCode}</strong></p>
//         <p>Ce code est valable pendant 1 heure.</p>
//       `,
//     };

//     // Envoi de l'email
//     const result = await transporter.sendMail(message);
//     console.log('Email de réinitialisation envoyé : ', result);
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email de réinitialisation : ', error);
//     throw new Error('L\'email de réinitialisation n\'a pas pu être envoyé');
//   }
// };

// export default sendMail;


import nodemailer from "nodemailer";

const sendMail = async (user, resetToken, verifCode) => {
  try {
    // Configuration du transporteur
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,  // Bypass les certificats auto-signés
      },
    });

    // Définir le message
    const message = {
      from: `"ENTACIG" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Bienvenue sur ENTACIG - Plateforme Sécurisée et Innovante",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2 style="color: #007bff;"> Bienvenue sur ENTACIG ! </h2>
          <p>Nous sommes ravis de vous accueillir sur notre plateforme <strong>ENTACIG</strong>, un espace sécurisé et innovant pour votre apprentissage et vos échanges académiques.</p>
          <p>Pour finaliser votre inscription, veuillez utiliser le code de vérification ci-dessous :</p>
          <div style="background: #f4f4f4; padding: 15px; display: inline-block; border-radius: 5px;">
            <h1 style="color: #007bff; margin: 0;">${verifCode}</h1>
          </div>
          <p>Ce code est valable pendant <strong>1 heure</strong>. Ne le partagez avec personne.</p>
          <p>Vous pouvez copier ce code en un clic :</p>
          <button onclick="navigator.clipboard.writeText('${verifCode}')" 
            style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Copier le code
          </button>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #777;" ENTACIG - Excellence et Sécurité au service de l'éducation.</p>
        </div>
      `,
    };

    // Envoi de l'e-mail
    const result = await transporter.sendMail(message);
    console.log("📧 E-mail envoyé :", result.response);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'e-mail :", error);
    throw new Error("L'e-mail n'a pas pu être envoyé.");
  }
};

export default sendMail;
