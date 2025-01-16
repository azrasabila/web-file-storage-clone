import { prisma } from '../config/prisma';

export const getFolderContents = async (folderId: string) => {
    return await prisma.folder.findUnique({
        where: { id: folderId },
        include: { files: true, children: true },
    });
};

export const getAllFolders = async () => {
    return await prisma.folder.findMany({
        include: {
            children: {
                include: {
                    children: true, // Recursively fetch nested folders
                },
            },
            files: true, // Include files in each folder
        },
    });
};

export const createFolder = async (
    name: string,
    path: string,
    userId: string,
    parentId: string | null
) => {
    return await prisma.folder.create({
        data: {
            name,
            path,
            userId,
            parentId,
        },
    });
};

export const deleteFolder = async (folderId: string) => {
    return await prisma.folder.delete({
        where: { id: folderId },
    });
};
