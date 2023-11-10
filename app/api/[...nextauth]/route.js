import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        if (!response.ok) {
          throw new Error("Response is not OK");
        }

        const data = await response.json();

        if (data.success) {
          const user = { id: 1, email: credentials.email }
          return Promise.resolve(user)
        } else {
          return Promise.resolve(null)
        }
      }
    })
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) token.user = user
      return token
    },
    async session(session, token) {
      session.user = token.user
      return session
    }
  }
})