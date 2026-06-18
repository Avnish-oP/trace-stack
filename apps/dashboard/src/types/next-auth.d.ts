import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      emailVerifiedAt?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    emailVerifiedAt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    emailVerifiedAt?: string | null;
  }
}
