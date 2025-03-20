import { PrismaClient } from '@prisma/client';

// Extend the global type to include prismadb

const client = global.prismadb || new PrismaClient();

if (process.env.NODE_ENV === 'production') global.prismadb = client;

export default client;
