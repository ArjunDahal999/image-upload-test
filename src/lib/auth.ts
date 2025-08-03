import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const config = {
  providers: [
    // For demo purposes, we'll use a simple credentials provider
    // In production, you'd use proper OAuth providers
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For demo purposes, accept any credentials
        // In production, validate against your user database
        if (credentials?.username && credentials?.password) {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@example.com",
          };
        }
        return null;
      },
    },
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUpload = nextUrl.pathname.startsWith("/upload");

      if (isOnUpload) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
