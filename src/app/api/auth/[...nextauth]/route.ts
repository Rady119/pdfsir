import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Must use nodejs runtime for bcryptjs and database operations
export const runtime = 'nodejs';