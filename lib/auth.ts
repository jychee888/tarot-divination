import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
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
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("請提供電子郵件和驗證碼");
        }

        // Verify OTP with database
        const otpRecord = await (prisma as any).emailOtp.findFirst({
          where: {
            email: credentials.email,
            otp: credentials.otp,
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!otpRecord) {
          throw new Error("驗證碼無效或已過期");
        }

        // Mark OTP as used
        await (prisma as any).emailOtp.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0],
              emailVerified: new Date(),
            },
          });
        }

        console.log("[Auth] Email OTP login successful for:", credentials.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[Auth] SignIn Attempt:", { email: user?.email, provider: account?.provider });
      return true;
    },
    async jwt({ token, user, account, profile }) {
      const adminEmails = [process.env.SUPER_ADMIN_EMAIL];
      
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
      const adminEmails = [process.env.SUPER_ADMIN_EMAIL];
      if (session.user && token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = adminEmails.includes(session.user.email as string) ? "admin" : (token.role || "user");
        // @ts-ignore
        session.user.nickname = token.nickname || "";
        
        // Update Last Active Time in background
        if (token.id) {
          // Temporarily commented out until Prisma Client sync issues are resolved
          /*
          prisma.user.update({
            where: { id: token.id as string },
            data: { lastActiveAt: new Date() } as any
          }).catch(err => console.error("[Auth] Failed to update lastActiveAt:", err));
          */
        }

        console.log("[Auth] Session Created for:", session.user.email, "Role:", session.user.role);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs in development
}
