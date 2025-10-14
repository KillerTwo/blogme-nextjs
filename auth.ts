import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "123456") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com"
          }
        }
        return null
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  debug: true,
})