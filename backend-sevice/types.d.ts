import { Request } from 'elysia';

declare module 'elysia' {
    interface Request {
        user?: {
            id: number;
            username: string;
            email: string;
        };
    }
}
