import { Elysia } from 'elysia';
import { getFolderContents, createFolder, deleteFolder, getAllFolders } from '../services/foldersService';

interface FolderBody {
    name: string;
    userId: string;
    parentId?: string;
}

interface FolderQueryParams {
    folderId: string;
}

interface DeleteParams {
    id: string;
}

export const folderRoutes = (app: Elysia) => {
    // Get folder contents
    app.get('/folder', async ({ query }: { query: FolderQueryParams }) => {
        const { folderId } = query;

        if (!folderId) {
            return { status: 400, message: 'Folder ID is required' };
        }

        try {
            const folder = await getFolderContents(folderId);
            return { status: 200, data: folder };
        } catch (error) {
            return { status: 500, message: 'Failed to retrieve folder contents' };
        }
    });

    app.get(
        '/folders/all',
        async () => {
            try {
                const folders = await getAllFolders();
                return { status: 200, data: folders };
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
