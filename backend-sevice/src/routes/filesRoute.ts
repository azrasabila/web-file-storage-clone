import { Elysia } from 'elysia';
import { getFilesInFolder, addFile, deleteFile, getFileById } from '../services/filesService';
import path from 'path';
import fs from 'fs';

interface FileBody {
    name: string;
    path: string;
    size: number;
    type: string | null;
    userId: number;
    folderId: number | null;
}

interface FolderQueryParams {
    folderId: string;
}

interface DeleteParams {
    id: string;
}

export const fileRoutes = (app: Elysia) => {
    // Get files in a folder
    app.get('/files', async ({ query }: { query: FolderQueryParams }) => {
        const { folderId } = query;

        if (!folderId) {
            return { status: 400, message: 'Folder ID is required' };
        }

        try {
            const files = await getFilesInFolder(folderId);
            return { status: 200, data: files };
        } catch (error) {
            return { status: 500, message: 'Failed to retrieve files' };
        }
    });

    app.post(
        '/files/upload',
        async ({ request }: { request: Request }) => {
            const contentType = request.headers.get('content-type');
            if (!contentType || !contentType.includes('multipart/form-data')) {
                return { status: 400, message: 'Invalid content type. Expected multipart/form-data.' };
            }

            const boundary = contentType.split('boundary=')[1];
            if (!boundary) {
                return { status: 400, message: 'Boundary not found in content type.' };
            }

            const reader = request.body?.getReader();
            if (!reader) {
                return { status: 400, message: 'Unable to read request body.' };
            }

            const uploadDir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            let fileName = '';
            let fileType = '';
            let filePath = '';
            let fileSize = 0;

            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            }

            const fullData = Buffer.concat(chunks);
            const parts = fullData.toString().split(`--${boundary}`);
            for (const part of parts) {
                if (part.includes('Content-Disposition: form-data; name="file";')) {
                    const [headers, fileData] = part.split('\r\n\r\n');
                    const dispositionMatch = headers.match(/filename="([^"]+)"/i);

                    if (dispositionMatch) {
                        fileName = dispositionMatch[1];
                        fileType = headers.match(/Content-Type: ([^\r\n]+)/)?.[1] || 'application/octet-stream';

                        filePath = path.join(uploadDir, fileName);
                        const buffer = Buffer.from(fileData, 'binary');
                        fs.writeFileSync(filePath, Uint8Array.from(buffer));
                        fileSize = fs.statSync(filePath).size;
                    }
                }
            }

            if (!fileName || !filePath) {
                return { status: 400, message: 'File upload failed. No file found in request.' };
            }

            const userId = request.headers.get('user-id');
            const folderId = request.headers.get('folder-id') ? request.headers.get('folder-id') : null;

            if (!userId) {
                return { status: 400, message: 'User ID is required in headers.' };
            }

            if (!folderId) {
                return { status: 400, message: 'Folder ID is required in headers.' };
            }

            const file = await addFile(fileName, filePath, fileSize, fileType, userId, folderId);

            return { status: 201, data: file };
        }
    );

    // Delete a file by ID
    app.delete('/files/:id', async ({ params }: { params: DeleteParams }) => {
        const { id } = params;


    try {
        const file = await getFileById(id);
        if (!file) {
            return { status: 404, message: 'File not found' };
        }

        const filePath = file.path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.warn(`File not found in directory: ${filePath}`);
        }

        await deleteFile(id);

        return { status: 200, message: 'File deleted successfully' };
    } catch (error) {
        console.error('Error deleting file:', error);
        return { status: 500, message: 'Failed to delete file' };
    }
    });
};

