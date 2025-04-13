import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Liste des domaines autorisés
const allowedDomains = [
  "immo1.shop",
  "www.immo1.shop",
  "immo2-franckicks.vercel.app",
];

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/verify",
  "/api/auth/reset-password",
];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute =
    nextUrl.pathname.startsWith("/signin") ||
    nextUrl.pathname.startsWith("/signup");

  // Vérifier si le domaine est autorisé
  const host = nextUrl.host;
  const isAllowedDomain = allowedDomains.some(
    (domain) => host === domain || host.endsWith(`.${domain}`)
  );

  if (!isAllowedDomain) {
    return NextResponse.redirect(new URL("/", `https://immo1.shop`));
  }

  // Gérer les routes API
  if (isApiRoute) {
    return NextResponse.next({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Vérifier l'authentification avec better-auth
  try {
    const response = await auth.handler(request);
    if (response.status === 401 && !isPublicRoute) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
    if (response.status === 200 && isAuthRoute) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return response;
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
    return NextResponse.next();
  }
}

// Configuration des routes à protéger
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
