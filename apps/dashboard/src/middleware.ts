export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect all dashboard routes, but allow auth and public pages
  matcher: ["/dashboard/:path*"],
};
