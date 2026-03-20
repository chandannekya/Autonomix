import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import type { DefaultJWT } from "next-auth/jwt";

// ─── Type Augmentation ────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      googleId: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface Profile {
    picture?: any; // ✅ fixes (profile as any).picture
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    googleId?: string;
    id?: string;
    image?: string;
  }
}

// ─── Auth Config ──────────────────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.googleId = account.providerAccountId;
        token.email = profile.email;
        token.name = profile.name;
        token.image = profile.picture; // ✅ no any — typed above

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: account.providerAccountId,
            email: profile.email,
            name: profile.name,
            image: profile.picture, // ✅ no any
          }),
        });
      }
      return token;
    },

    async session({ session, token }) {
      session.user.googleId = token.googleId as string;
      session.user.id = token.sub as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
