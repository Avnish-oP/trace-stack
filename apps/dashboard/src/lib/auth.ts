import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Server-side URL (used by proxy.ts & authorize callback).
// Falls back to NEXT_PUBLIC_API_URL for convenience in dev.
const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
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
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist the accessToken from api-server
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
        token.emailVerifiedAt = user.emailVerifiedAt;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose accessToken and userId to the client session
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.emailVerifiedAt = token.emailVerifiedAt;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});
