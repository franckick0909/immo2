import { NextResponse } from "next/server";

export function middleware() {
  // Récupérer la réponse
  const response = NextResponse.next();

  // Ajouter les en-têtes CORS
  response.headers.set("Access-Control-Allow-Origin", "https://www.immo1.shop");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Gérer les requêtes OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.immo1.shop",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
