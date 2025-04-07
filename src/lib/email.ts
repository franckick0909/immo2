import { resend } from "./resend";

export const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        await resend.emails.send({
            from: "noreply@resend.dev",
            to: email,
            subject,
            text,
        });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        throw error;
    }
};