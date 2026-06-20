import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth configuration.
 *
 * This config is intentionally free of any providers (and therefore free of
 * Node-only APIs like `fetch` to the api-server). It is the config used by the
 * edge `proxy.ts` so that session cookies can be read/decrypted correctly in
 * the edge runtime without trying to initialize the Credentials provider.
 *
 * The full config in `lib/auth.ts` spreads this and adds the Credentials
 * provider, which only runs in the Node.js runtime.
 */
export const authConfig = {
  trustHost: true,
  // Providers are added in lib/auth.ts (Node runtime only).
  providers: [],
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
} satisfies NextAuthConfig;
