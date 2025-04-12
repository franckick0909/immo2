import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/signin", "/signup", "/profile", "/profile/edit", "/emailVerification"];
const passwordRoutes = ["/reset-password"];

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
