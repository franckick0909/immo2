import { sendEmail } from "@/actions/email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { prisma } from "./prisma";

// Configuration des cookies pour permettre le partage entre les domaines
const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  // Définir le domaine pour les cookies
  domain: process.env.NODE_ENV === "production" ? ".immo1.shop" : undefined,
};

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
      console.log("Envoi d'email de vérification à:", user.email);
      console.log("URL de vérification:", url);
      console.log("Token:", token);

      try {
        const result = await sendEmail({
          to: user.email,
          subject: "Confirmez votre adresse email pour activer votre compte",
          text: `Cliquez sur le lien pour vérifier votre email: ${url}`,
        });

        console.log("Résultat de l'envoi d'email:", result);

        if (!result.success) {
          console.error("Échec de l'envoi d'email:", result.message);
          // Ne pas afficher de toast ici, car cela peut causer des problèmes côté client
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi d'email:", error);
        // Ne pas afficher de toast ici, car cela peut causer des problèmes côté client
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
        console.log("URL de vérification:", url);

        try {
          const result = await sendEmail({
            to: newEmail,
            subject: "Confirmez votre changement d'email",
            text: `Cliquez sur le lien pour vérifier: ${url}`,
          });

          console.log("Résultat de l'envoi d'email:", result);

          if (!result.success) {
            console.error("Échec de l'envoi d'email:", result.message);
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi d'email:", error);
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
  // Configuration des cookies au niveau de l'authentification
  cookies: cookieOptions,
});

type Session = typeof auth.$Infer.Session;

export type { Session };
