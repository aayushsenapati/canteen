import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const response = await fetch('http://server:5000/Vendor/Verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ EmailID: credentials.email, Password: hashedPassword })
        });

        if (!response.ok) {
          throw new Error("Response is not OK");
        }

        const data = await response.json();

        if (data.Success) {
          const user = { id: 1, email: credentials.email }
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/signIn",
  },
});

export { handler as GET, handler as POST };
  