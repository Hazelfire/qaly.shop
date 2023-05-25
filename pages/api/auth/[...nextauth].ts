import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Todo Google auth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  database: process.env.DATABASE_URL,
  // Optional: You can specify other options here, such as JSON Web Token (JWT) signing/encryption keys, session configuration, callbacks, etc.
}

export default NextAuth(authOptions)
