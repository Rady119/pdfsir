import { 
  NextAuthOptions,
  DefaultSession,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/auth';
import { User } from '@/models/User';
import connectDB from '@/lib/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      subscription?: string;
    } & DefaultSession['user']
  }

  interface CustomUser {
    id: string;
    email: string;
    subscription?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    subscription?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          subscription: user.subscription,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subscription = (user as { subscription?: string }).subscription;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};