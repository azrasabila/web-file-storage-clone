import { prisma } from '../config/prisma';

export const getFolderContents = async (userId: string, folderId: string | undefined) => {
    return await prisma.folder.findUnique({
        where: { id: folderId, userId: userId },
        include: { files: true, children: true },
    });
};


export const getAllFolders = async (userId: string): Promise<any[]> => {
    const folders = await prisma.folder.findMany({
        where: { userId: userId },
        include: {
            files: true, // Include associated files
        },
    });

    return folders;
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
