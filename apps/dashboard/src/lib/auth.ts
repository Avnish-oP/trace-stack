import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";

// Server-side URL (used by proxy.ts & authorize callback).
// Falls back to NEXT_PUBLIC_API_URL for convenience in dev.
const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!apiUrl) {
          return null;
        }

        try {
          const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            return null;
          }

          // Return the user object + accessToken from api-server
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            image: data.data.user.image,
            emailVerifiedAt: data.data.user.emailVerifiedAt,
            accessToken: data.data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
