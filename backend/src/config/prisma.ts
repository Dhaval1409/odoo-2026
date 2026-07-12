import * as PrismaPkg from '@prisma/client';
const PrismaClient = (PrismaPkg as any).PrismaClient;
const prisma = new PrismaClient();
export default prisma;