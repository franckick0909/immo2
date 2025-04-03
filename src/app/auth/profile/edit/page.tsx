"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { useUserStore } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdAddAPhoto, MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { deleteAccount, updateProfile } from "./actions";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const { updateUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    session?.user?.image || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!session?.user) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleImageUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("name", session?.user?.name || "");
      formData.append("email", session?.user?.email || "");

      const result = await updateProfile(formData);
      if (result.success && result.user?.image) {
        toast.success("Photo de profil mise à jour avec succès");
        updateUser({ image: result.user.image });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profil mis à jour avec succès");
        updateUser({
          name: result.user?.name || "",
          email: result.user?.email || "",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setIsLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success("Compte supprimé avec succès");
        router.push("/");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Modifier le profil</h1>

        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Photo de profil"
                    width={120}
                    height={120}
                    className="object-cover rounded-full w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdAddAPhoto className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <div>
                    <Input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-[11px] rounded-md"
                    >
                      Choisir une photo
                    </Label>
                  </div>
                  {previewImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <MdDelete className="w-4 h-4" />
                      Supprimer
                    </Button>
                  )}
                </div>
                {selectedFile && (
                  <Button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? "Mise à jour..." : "Mettre à jour la photo"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={session.user.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={session.user.email}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  Supprimer le compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Cela supprimera
                    définitivement votre compte et toutes vos données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Suppression..." : "Supprimer le compte"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
