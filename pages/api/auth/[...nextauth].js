import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    // Todo Google auth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  database: process.env.DATABASE_URL,
  // Optional: You can specify other options here, such as JSON Web Token (JWT) signing/encryption keys, session configuration, callbacks, etc.
})
