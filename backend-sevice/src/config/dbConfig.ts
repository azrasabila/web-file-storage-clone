import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const initializeDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('🚀 Database connection established');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
