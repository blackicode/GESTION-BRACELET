import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpByEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `"ENTACIG" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Votre code de vérification ENTACIG",
    html: `
      <div style="font-family: Arial; text-align: center;">
        <h2>Code de vérification</h2>
        <p>Voici votre code à usage unique :</p>
        <h1>${code}</h1>
        <p>Ce code expire dans 1 heure.</p>
      </div>
    `,
  };

  await transporter.sendMail(message);
};
