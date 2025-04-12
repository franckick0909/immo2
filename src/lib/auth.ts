import { sendEmail } from "@/actions/email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { toast } from "sonner";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      toast.success(`Envoi d'email de vérification à: ${user.email}`);
      console.log("Envoi d'email de vérification à:", user.email);
      console.log("URL de vérification:", url);
      toast.success(`URL de vérification: ${url}`);
      console.log("Token:", token);
      toast.success(`Token: ${token}`);

      try {
        const result = await sendEmail({
          to: user.email,
          subject: "Confirmez votre adresse email pour activer votre compte",
          text: `Cliquez sur le lien pour vérifier votre email: ${url}`,
        });

        console.log("Résultat de l'envoi d'email:", result);
        toast.success(`Résultat de l'envoi d'email: ${result}`);

        if (!result.success) {
          console.error("Échec de l'envoi d'email:", result.message);
          toast.error(`Échec de l'envoi d'email: ${result.message}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi d'email:", error);
        toast.error(`Erreur lors de l'envoi d'email: ${error}`);
      }
    },
  },
  user: {
    additionalFields: {
      premium: {
        type: "boolean",
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        console.log("Envoi d'email de changement d'email à:", newEmail);
        toast.success(`Envoi d'email de changement d'email à: ${newEmail}`);
        console.log("URL de vérification:", url);
        toast.success(`URL de vérification: ${url}`);

        try {
          const result = await sendEmail({
            to: newEmail,
            subject: "Confirmez votre changement d'email",
            text: `Cliquez sur le lien pour vérifier: ${url}`,
          });

          console.log("Résultat de l'envoi d'email:", result);
          toast.success(`Résultat de l'envoi d'email: ${result}`);

          if (!result.success) {
            console.error("Échec de l'envoi d'email:", result.message);
            toast.error(`Échec de l'envoi d'email: ${result.message}`);
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi d'email:", error);
          toast.error(`Erreur lors de l'envoi d'email: ${error}`);
        }
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["user:email", "read:user"],
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile"],
    },
  },
  plugins: [admin(), nextCookies()],
});

type Session = typeof auth.$Infer.Session;

export type { Session };
