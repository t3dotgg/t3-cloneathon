import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma"; // Import Prisma client
import bcrypt from 'bcryptjs'; // Import bcryptjs

// Define a type for the user object returned by authorize, extending NextAuthUser
interface AuthorizeUser extends NextAuthUser {
  id: string;
  // Add other custom properties if any, e.g., name, email
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<AuthorizeUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null; // User not found
          }

          // Validate password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email);
            return null; // Passwords don't match
          }

          console.log("User authenticated:", user.email);
          // Return user object without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            // image: user.image, // if you have images
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null; // Error during authorization
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Potentially add a profile callback here to create/link user in your DB
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist the user ID from the user object (returned by authorize or OAuth profile) to the token
      if (user) {
        token.id = user.id; // user.id should be part of the AuthorizeUser or OAuth profile
      }
      // Example: Persisting OAuth access_token and provider info if needed
      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.provider = account.provider;
      // }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like user ID from the token.
      // The type for session.user needs to accommodate 'id'
      if (session.user && token.id) {
        (session.user as any).id = token.id; // Cast to any or extend Session['user'] type
      }
      // if (session.user && token.accessToken) {
      //   (session.user as any).accessToken = token.accessToken;
      // }
      // if (session.user && token.provider) {
      //   (session.user as any).provider = token.provider;
      // }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirect users to /login page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
    // newUser: null // If set, new users will be directed here on first sign in
  },
  // Optionally, add secret for production
  // secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
