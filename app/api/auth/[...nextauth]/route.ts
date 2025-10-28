import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

// 添加日誌幫助調試
console.log('NextAuth 配置加載中...')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '已設置' : '未設置')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '已設置' : '未設置')

export const authOptions: NextAuthOptions = {
  debug: false, // 關閉調試模式，只記錄錯誤
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (!user || !account) {
          throw new Error('User or account is missing');
        }
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('[NextAuth][signIn] 登入失敗', { 
          error: errorMessage,
          userId: user?.id,
          accountProvider: account?.provider
        });
        return false;
      }
    },
    async session({ session, user, token }) {
      try {
        if (!session?.user) {
          throw new Error('Session user is missing');
        }
        session.user.id = user.id;
        // @ts-ignore
        session.user.nickname = user.nickname;
        // @ts-ignore
        session.user.bio = user.bio;
        return session;
      } catch (error) {
        console.error('[NextAuth][session] 會話處理失敗', { 
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          userId: user?.id
        });
        return {
          ...session,
          user: {
            ...session.user,
            id: user?.id || '',
            name: session.user?.name || '',
            email: session.user?.email || null,
            image: session.user?.image || null
          }
        };
      }
    }
  },
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth][error] ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth][warn] ${code}`);
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
