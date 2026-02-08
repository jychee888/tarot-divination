import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      nickname?: string;
      bio?: string;
      birthday?: string;
      birthTime?: string;
      gender?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    nickname?: string;
    bio?: string;
    birthday?: string;
    birthTime?: string;
    gender?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nickname?: string;
    bio?: string;
    role?: string;
  }
}
