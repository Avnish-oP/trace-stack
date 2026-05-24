import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

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
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist the accessToken from api-server
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose accessToken and userId to the client session
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
