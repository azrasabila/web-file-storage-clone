import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import 'reflect-metadata';
import { fileRoutes } from './routes/filesRoute';
import { initializeDatabase } from './config/dbConfig';
import { folderRoutes } from './routes/foldersRoute';
import { userRoutes } from './routes/usersRoute';
import cors from '@elysiajs/cors';

const app = new Elysia()
    .use(cors())
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia App API',
                    description: 'API documentation for the Elysia app',
                    version: '1.0.0',
                },
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'Local Development Server',
                    },
                ],
            },
        })
    )
    .get('/hello', () => ({ message: 'Hello, Swagger!' }))
    .listen(3000);

fileRoutes(app);
folderRoutes(app);
userRoutes(app);

initializeDatabase();
console.log(`Elysia app is running at http://localhost:3000`);
