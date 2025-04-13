import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Utiliser l'URL de l'application configurée dans les variables d'environnement
const baseURL = process.env.NEXT_PUBLIC_APP_URL || "https://immo1.shop";

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [adminClient()],
});

export const { signIn, signOut, signUp, useSession, verifyEmail } = authClient;
