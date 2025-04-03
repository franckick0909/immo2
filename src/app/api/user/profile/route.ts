import { auth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });

    return NextResponse.json({
      user: session.user,
      accounts,
    });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as File | null;

    if (!name || !email) {
      return new NextResponse("Données manquantes", { status: 400 });
    }

    // Si une nouvelle image est fournie, l'uploader vers Cloudinary
    let imageUrl = session.user.image;
    if (image) {
      try {
        // Uploader directement le fichier vers Cloudinary
        imageUrl = await uploadImageToCloudinary(image);
      } catch (error) {
        console.error("[IMAGE_UPLOAD]", error);
        return new NextResponse("Erreur lors de l'upload de l'image", {
          status: 500,
        });
      }
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

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    await prisma.user.delete({
      where: {
        email: session.user.email,
      },
    });

    await auth.api.signOut({
      headers: await headers(),
    });

    toast.success("Compte supprimé avec succès");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROFILE_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
