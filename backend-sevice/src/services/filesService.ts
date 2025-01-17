import { prisma } from '../config/prisma';
import fs from 'fs';
import path from 'path';

export const getFilesInFolder = async (folderId: string) => {
    return await prisma.file.findMany({
        where: { folderId },
    });
};

export const saveUploadedFile = async (file: NodeJS.ReadableStream, filename: string): Promise<string> => {
    const uploadPath = path.join(__dirname, '../../uploads', filename);

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(uploadPath);

        file.pipe(writeStream)
            .on('finish', () => resolve(uploadPath))
            .on('error', (err) => reject(err));
    });
};

export const addFile = async (
    name: string,
    filePath: string,
    size: number,
    type: string | null,
    userId: string,
    folderId: string
) => {
    return await prisma.file.create({
        data: {
            name,
            path: filePath,
            size,
            type,
            userId,
            folderId,
        },
    });
};

export const getFileById = async (id: string) => {
    return await prisma.file.findUnique({
        where: { id },
    });
};

export const deleteFile = async (id: string) => {
    return await prisma.file.delete({
        where: { id },
    });
};