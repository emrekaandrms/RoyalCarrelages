import { PrismaClient } from '@prisma/client';

// PrismaClient birden fazla kez oluşturulursa hot-reload sırasında uyarı verir.
// Bu nedenle globalThis üzerinde cache'leyelim.
// https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 