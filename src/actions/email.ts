"use server";

import sgMail from "@sendgrid/mail";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  console.log("Tentative d'envoi d'email à:", to);
  console.log("Sujet:", subject);
  console.log("Texte:", text);

  // Vérifier les variables d'environnement
  if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY n'est pas définie");
    return {
      success: false,
      message: "SENDGRID_API_KEY environment variable is not set",
    };
  }

  if (!process.env.EMAIL_FROM) {
    console.error("EMAIL_FROM n'est pas définie");
    return {
      success: false,
      message: "EMAIL_FROM environment variable is not set",
    };
  }

  console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
  console.log("SENDGRID_API_KEY est définie:", !!process.env.SENDGRID_API_KEY);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.EMAIL_FROM,
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    console.log("Envoi de l'email via SendGrid...");
    const [response] = await sgMail.send(message);

    if (response.statusCode !== 202) {
      console.error(`SendGrid API a retourné le code ${response.statusCode}`);
      return {
        success: false,
        message: `SendGrid API returned status code ${response.statusCode}`,
      };
    }

    console.log(
      "Email envoyé avec succès, ID:",
      response.headers["x-message-id"]
    );
    return {
      success: true,
      messageId: response.headers["x-message-id"],
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
