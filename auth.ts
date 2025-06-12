import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

/**
 * NextAuth v5 (Auth.js) Configuration
 * Simple GitHub-only authentication
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session }) {
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
})
