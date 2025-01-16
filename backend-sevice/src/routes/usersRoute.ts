import { Elysia } from 'elysia';
import { createUser, getUserById, deleteUser } from '../services/usersService';

interface UserBody {
    username: string;
    email: string;
    password: string;
}

interface UserParams {
    id: string;
}

export const userRoutes = (app: Elysia) => {
    // Create a new user
    app.post('/users', async ({ body }: { body: UserBody }) => {
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return { status: 400, message: 'Missing required fields' };
        }

        try {
            const user = await createUser(username, email, password);
            return { status: 201, data: user };
        } catch (error) {
            return { status: 500, message: 'Failed to create user: ' + error };
        }
    });

    // Get a user by ID
    app.get('/users/:id', async ({ params }: { params: UserParams }) => {
        const { id } = params;

        if (!id) {
            return { status: 400, message: 'User ID is required' };
        }

        try {
            const user = await getUserById(id);
            return { status: 200, data: user };
        } catch (error) {
            return { status: 500, message: 'Failed to retrieve user' };
        }
    });

    // Delete a user by ID
    app.delete('/users/:id', async ({ params }: { params: UserParams }) => {
        const { id } = params;

        if (!id) {
            return { status: 400, message: 'User ID is required' };
        }

        try {
            await deleteUser(id);
            return { status: 200, message: 'User deleted successfully' };
        } catch (error) {
            return { status: 500, message: 'Failed to delete user' };
        }
    });
};
