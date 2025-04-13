import { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

// Routes qui nécessitent une authentification
const authRoutes = [
  "/signin",
  "/signup",
  "/profile",
  "/profile/edit",
  "/emailVerification",
];
const passwordRoutes = ["/reset-password"];
const adminRoutes = ["/admin"];

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/properties",
  "/properties/[id]",
  "/blog",
  "/blog/[id]",
  "/faq",
  "/terms",
  "/privacy",
  // Routes du dossier (immo)
  "/achat",
  "/achat/[id]",
  "/location",
  "/location/[id]",
  "/luxe",
  "/luxe/[id]",
  "/vente",
  "/vente/[id]",
];

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  // Gestion des en-têtes CORS pour les routes API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Accepter toutes les origines
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*"); // Accepter toutes les origines
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  const pathName = request.nextUrl.pathname;

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => {
    // Gérer les routes dynamiques comme /properties/[id]
    if (route.includes("[") && route.includes("]")) {
      const routePattern = new RegExp(
        "^" + route.replace(/\[.*?\]/g, "[^/]+") + "$"
      );
      return routePattern.test(pathName);
    }
    return pathName === route || pathName.startsWith(route + "/");
  });

  // Si c'est une route publique, permettre l'accès sans authentification
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session) {
      if (isAuthRoute || isPasswordRoute) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    // En cas d'erreur, permettre l'accès aux routes publiques
    if (isPublicRoute || isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    // Sinon, rediriger vers la page de connexion
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
