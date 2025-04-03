"use server";

import { v2 as cloudinary } from "cloudinary";

// Configuration de Cloudinary (côté serveur uniquement)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload une image vers Cloudinary (côté serveur uniquement)
 * @param file Le fichier à uploader
 * @param folder Le dossier de destination dans Cloudinary
 * @returns L'URL de l'image uploadée
 */
export async function uploadImageToCloudinary(
  file: File,
  folder = "profile-images"
): Promise<string> {
  try {
    // Convertir le fichier en buffer
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64Image}`;

    // Uploader vers Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto:good" },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error("Erreur lors de l'upload vers Cloudinary:", error);
    throw new Error("Échec de l'upload de l'image");
  }
}

/**
 * Supprime une image de Cloudinary (côté serveur uniquement)
 * @param imageUrl L'URL de l'image à supprimer
 */
export async function deleteImageFromCloudinary(
  imageUrl: string
): Promise<boolean> {
  try {
    // Extraire l'ID public de l'URL
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
    const folder = imageUrl.split("/").slice(-2)[0];

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return false;
  }
}

/**
 * Fonction pour accéder à l'API Cloudinary directement si nécessaire
 * @returns L'instance configurée de cloudinary
 */
export async function getCloudinaryInstance() {
  return cloudinary;
}
