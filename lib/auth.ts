import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[Auth] SignIn Attempt:", { email: user?.email, provider: account?.provider });
      return true;
    },
    async jwt({ token, user, account, profile }) {
      const adminEmails = ["jychee888@gmail.com"];
      
      // First time login
      if (user) {
        console.log("[Auth] Initial JWT Creation for:", user.email);
        token.id = user.id;
        // @ts-ignore
        token.role = adminEmails.includes(user.email as string) ? "admin" : (user.role || "user");
        // @ts-ignore
        token.nickname = user.nickname || "";
      } 
      // Subsequent requests: refresh from DB if needed
      else if (token.id) {
        try {
          // @ts-ignore - Temporary removal of role from select to fix Prisma error
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { nickname: true } // Removed role: true here
          });
          
          if (dbUser) {
            // @ts-ignore
            token.nickname = dbUser.nickname || "";
            // Re-apply admin check on refresh
            if (!token.role || token.role === "user") {
              // @ts-ignore
              token.role = adminEmails.includes(token.email as string) ? "admin" : "user";
            }
          }
        } catch (error) {
          console.error("[Auth] Error refreshing user from DB in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      const adminEmails = ["jychee888@gmail.com"];
      if (session.user && token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = adminEmails.includes(session.user.email as string) ? "admin" : (token.role || "user");
        // @ts-ignore
        session.user.nickname = token.nickname || "";
        console.log("[Auth] Session Created for:", session.user.email, "Role:", session.user.role);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs in development
}
