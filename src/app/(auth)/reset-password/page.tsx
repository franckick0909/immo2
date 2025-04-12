"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!token) {
      toast.error("Token de réinitialisation manquant");
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      toast.success("Mot de passe réinitialisé avec succès");
      router.push("/signin");
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">
          Confirmation du mot de passe
        </Label>
        <Input
          id="password_confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <Card className="z-50 rounded-md-none max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Réinitialiser le mot de passe
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Entrez votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Chargement...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              Vous avez déjà un compte ?{" "}
              <Link href="/signin" className="underline">
                <span className="text-orange-500 font-bold">Connexion</span>
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
