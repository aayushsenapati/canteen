import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

const handler= NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const response = await fetch('http://server:5000/Vendor/Verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ EmailID: credentials.email })
        });

        if (!response.ok) {
          throw new Error("Response is not OK");
        }

        const data = await response.json();

        if (data.Error) {
          throw new Error(data.Error);
        }

        const isMatch = await bcrypt.compare(credentials.password, data.HashedPassword);
        console.log(isMatch)

        if (isMatch) {
          const user = { id: 1, email: credentials.email }
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET,handler as POST}

  