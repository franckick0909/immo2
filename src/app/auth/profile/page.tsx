import SignOutButton from "@/components/auth/signout-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getUser } from "@/lib/auth-session";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  MdAccessTime,
  MdAccountCircle,
  MdCalendarToday,
  MdEmail,
  MdPerson,
  MdSecurity,
  MdVerifiedUser,
} from "react-icons/md";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center space-y-8">
          {/* En-tête du profil */}
          <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-amber-300 rounded-full overflow-hidden flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ""}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-4xl">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <MdEmail className="h-4 w-4" />
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {accounts.map((account) => (
                    <Badge
                      key={account.provider}
                      variant="secondary"
                      className="capitalize"
                    >
                      {account.provider}
                    </Badge>
                  ))}
                  {user.emailVerified && (
                    <Badge
                      variant="success"
                      className="flex items-center gap-1"
                    >
                      <MdVerifiedUser className="h-3 w-3" />
                      Email vérifié
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grille des cartes d'information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Informations personnelles */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MdPerson className="h-6 w-6 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdPerson className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdEmail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="p-2">
                  <SignOutButton />
                </div>
              </CardContent>
            </Card>

            {/* Informations du compte */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MdAccountCircle className="h-6 w-6 text-primary" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.provider}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <MdAccountCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p className="font-medium capitalize">
                        {account.provider}
                      </p>
                      {account.scopes && account.scopes.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {account.scopes.map((scope) => (
                            <Badge
                              key={scope}
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdCalendarToday className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Membre depuis
                    </p>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdAccessTime className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Dernière mise à jour
                    </p>
                    <p className="font-medium">
                      {format(new Date(user.updatedAt), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MdSecurity className="h-6 w-6 text-primary" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdVerifiedUser className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Statut de l&apos;email
                    </p>
                    <p className="font-medium">
                      {user.emailVerified ? "Vérifié" : "Non vérifié"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MdSecurity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      ID du compte
                    </p>
                    <p className="font-medium font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
