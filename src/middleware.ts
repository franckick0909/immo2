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

// Domaines autorisés
const allowedDomains = ["immo1.shop", "www.immo1.shop"];

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  // Rediriger les requêtes de immo2-franckicks.vercel.app vers immo1.shop
  if (request.headers.get("host")?.includes("immo2-franckicks.vercel.app")) {
    const url = request.nextUrl.clone();
    url.host = "immo1.shop";
    return NextResponse.redirect(url);
  }

  // Gestion des en-têtes CORS pour les routes API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "";
    const isAllowedOrigin = allowedDomains.some((domain) =>
      origin.includes(domain)
    );

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": isAllowedOrigin
            ? origin
            : allowedDomains[0],
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set(
      "Access-Control-Allow-Origin",
      isAllowedOrigin ? origin : allowedDomains[0]
    );
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
    // Utiliser l'URL de l'application configurée dans les variables d'environnement
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "https://immo1.shop";

    console.log("Vérification de session avec baseURL:", baseURL);
    console.log("Cookies:", request.headers.get("cookie"));

    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: baseURL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    console.log("Session:", session ? "Trouvée" : "Non trouvée");

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
