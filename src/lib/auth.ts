import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { resend } from "./resend";

interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string;
  avatar_url: string;
}

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.user.email,
        subject: "Réinitialisation de mot de passe",
        text: `Cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe: ${data.url} \n Si vous n'avez pas demandé de réinitialisation, veuillez ignorer cet email.`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scopes: ["user:email", "read:user"],
      profile: async (profile: GitHubProfile) => {
        console.log("GitHub Profile:", profile); // Pour déboguer
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scopes: ["openid", "email", "profile"],
      profile: async (profile: GoogleProfile) => {
        console.log("Google Profile:", profile); // Pour déboguer
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  },
  plugins: [nextCookies()],
});
