import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, subject: string, html: string) => {
    try {
        const response = await resend.emails.send({
            from: "noreply@resend.com",
            to: email,
            subject,
            html,
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
