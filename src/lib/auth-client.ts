import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL as string,
  plugins: [
    adminClient()
  ]
});

export const { signIn, signOut, signUp, useSession, verifyEmail } = authClient;