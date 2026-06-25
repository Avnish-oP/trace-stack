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
    async jwt({ token, user, account, profile }) {
      console.log("JWT callback triggered. User:", user ? { id: user.id, email: user.email, hasToken: !!user.accessToken } : "none");
      if (account?.provider === "github" && profile) {
        // It's a GitHub sign in. Hit the API to get an access token
        const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
          try {
            const res = await fetch(`${apiUrl}/api/v1/auth/oauth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name || profile.login,
                image: profile.avatar_url,
                provider: "github",
              }),
            });
            const data = await res.json();
            if (data.success) {
              token.accessToken = data.data.accessToken;
              token.userId = data.data.user.id;
              token.emailVerifiedAt = data.data.user.emailVerifiedAt;
              console.log("OAuth token set on JWT:", token.accessToken ? "yes" : "no");
            }
          } catch (e) {
            console.error("OAuth token exchange failed", e);
          }
        }
      }

      // On initial sign-in, user is passed. Copy the fields if available.
      if (user) {
        if (user.accessToken) {
          token.accessToken = user.accessToken;
          console.log("Credentials token set on JWT:", token.accessToken ? "yes" : "no");
        } else {
          console.log("No user.accessToken found to set on JWT");
        }
        token.userId = user.id;
        token.emailVerifiedAt = user.emailVerifiedAt;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback triggered. Token has token:", !!token.accessToken);
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
