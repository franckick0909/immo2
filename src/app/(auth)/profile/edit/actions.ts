"use server";

import { auth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (!session?.user?.email) {
      throw new Error("Non autorisé");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as File | null;

    if (!name || !email) {
      throw new Error("Données manquantes");
    }

    // Si une nouvelle image est fournie, l'uploader vers Cloudinary
    let imageUrl = session.user.image;
    if (image) {
      imageUrl = await uploadImageToCloudinary(image as unknown as File);
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        email,
        image: imageUrl,
      },
    });

    revalidatePath("/auth/profile");
    revalidatePath("/auth/profile/edit");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return { success: false, error: "Erreur lors de la mise à jour du profil" };
  }
}

export async function deleteAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      throw new Error("Non autorisé");
    }

    await prisma.user.delete({
      where: {
        email: session.user.email,
      },
    });

    await auth.api.signOut({
      headers: await headers(),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_DELETE]", error);
    return { success: false, error: "Erreur lors de la suppression du compte" };
  }
}
