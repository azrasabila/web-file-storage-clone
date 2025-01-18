import { Elysia } from 'elysia';
import { createFolder, deleteFolder, getAllFolders, getFolderContents } from '../services/foldersService';

interface FolderBody {
    name: string;
    userId: string;
    parentId?: string;
}

interface FolderQueryParams {
    folderId?: string;
    userId: string;
}

interface DeleteParams {
    id: string;
}

export const folderRoutes = (app: Elysia) => {
    // Get folder contents
    app.get('/folder', async ({ query }: { query: FolderQueryParams }) => {
        const { folderId, userId } = query;

        if (!userId) {
            return { status: 400, message: 'User ID is required' };
        }

        try {
            const folder = await getFolderContents(userId, folderId);
            return { status: 200, data: folder };
        } catch (error) {
            return { status: 500, message: 'Failed to retrieve folder contents' };
        }
    });

    app.get(
        '/folders/all',
        async ({ query }: { query: FolderQueryParams }) => {
            const userId = query.userId;
            if (!userId) {
                return { status: 400, message: 'User ID is required' };
            }

            try {
                const folders = await getAllFolders(userId);
                const folderTree = buildFolderTree(folders)
                return { status: 200, data: folderTree };
            } catch (error) {
                return { status: 500, message: 'Failed to retrieve folders and files' };
            }
        }
    );

    // Create a new folder
    app.post('/folders', async ({ body }: { body: FolderBody }) => {
        const { name, userId, parentId } = body;

        if (!name || !userId) {
            return { status: 400, message: 'Missing required fields' };
        }
        const path = '/' + name

        try {
            const folder = await createFolder(name, path, userId, parentId || null);
            return { status: 201, data: folder };
        } catch (error) {
            return { status: 500, message: `Failed to create folder: ${error}` };
        }
    });

    // Delete a folder by ID
    app.delete('/folders/:id', async ({ params }: { params: DeleteParams }) => {
        const { id } = params;

        if (!id) {
            return { status: 400, message: 'Folder ID is required' };
        }

        try {
            await deleteFolder(id);
            return { status: 200, message: 'Folder deleted successfully' };
        } catch (error) {
            return { status: 500, message: `Failed to delete folder: ${error}` };
        }
    });
};

const buildFolderTree = (folders: any[]): any[] => {
    const folderMap = new Map<string, any>();

    // Create a map of folders by their ID
    folders.forEach((folder) => {
        folder.children = []; // Initialize the children array
        folderMap.set(folder.id, folder);
    });

    const tree: any[] = [];

    // Iterate through folders and assign them to their parent's children array
    folders.forEach((folder) => {
        if (folder.parentId) {
            const parent = folderMap.get(folder.parentId);
            if (parent) {
                parent.children.push(folder);
            }
        } else {
            // If no parentId, it's a root folder
            tree.push(folder);
        }
    });

    return tree;
};
