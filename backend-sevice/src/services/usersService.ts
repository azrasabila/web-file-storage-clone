import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';

export const createUser = async (username: string, email: string, password: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });
};

export const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
    });
};

export const deleteUser = async (userId: string) => {
    return await prisma.user.delete({
        where: { id: userId },
    });
};
