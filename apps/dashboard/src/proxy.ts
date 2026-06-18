import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, search } = req.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Logged-in users shouldn't see login/register pages
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Unauthenticated users can't access dashboard
  if (isDashboardRoute && !isLoggedIn) {
    const from = search ? `${pathname}${search}` : pathname;
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.nextUrl),
    );
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
