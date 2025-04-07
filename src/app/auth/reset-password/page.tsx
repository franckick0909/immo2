"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) {
    // Formulaire de demande de réinitialisation de mot de passe
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Réinitialisation de mot de passe</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de réinitialisation de
              mot de passe et réinitialiser votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              action={async (formData) => {
                const email = formData.get("email");
                await authClient.forgetPassword({
                  email: email as string,
                  redirectTo: "/auth/reset-password",
                  fetchOptions: {
                    onResponse: () => {
                      toast.error("Une erreur est survenue");
                    },
                    onSuccess: () => {
                      toast.success(
                        "Un email de réinitialisation de mot de passe a été envoyé"
                      );
                      router.push("/auth/signin");
                    },
                  },
                });
              }}
            >
              <Label htmlFor="email">Votre email</Label>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                required
              />
              <Button type="submit">Envoyer</Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80 transition-colors border-b border-primary"
          >
            Retour à la page d&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // Formulaire de réinitialisation de mot de passe
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Entrez votre nouveau mot de passe. {token}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              action={async (formData) => {
                const password = formData.get("password");
                await authClient.resetPassword({
                  newPassword: password as string,
                  token: token as string,
                  fetchOptions: {
                    onResponse: () => {
                      toast.error("Une erreur est survenue");
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                    },
                    onSuccess: () => {
                      toast.success("Mot de passe réinitialisé avec succès");
                      router.push("/");
                    },
                  },
                });
              }}
            >
              <Label htmlFor="password">Votre nouveau mot de passe</Label>
              <Input
                type="password"
                placeholder="Mot de passe"
                name="password"
                id="password"
                required
              />
              <Button type="submit">Réinitialiser le mot de passe</Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Retour à la page d&apos;accueil
          </Link>
        </div>
      </div>
  );
}
