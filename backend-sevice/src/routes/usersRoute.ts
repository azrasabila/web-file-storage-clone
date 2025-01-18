import { Elysia, t } from 'elysia';
import { createUser, getUserById, deleteUser, getUsers } from '../services/usersService';

export const userRoutes = (app: Elysia) => {
    // Create a new user
    app.post(
        '/users',
        async ({ body }) => {
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
        },
        {
            description: 'Create a new user',
            body: t.Object({
                username: t.String({ description: 'The username of the user' }),
                email: t.String({ description: 'The email of the user' }),
                password: t.String({ description: 'The password of the user' }),
            }),
            response: {
                201: t.Object({
                    data: t.Object({
                        id: t.String({ description: 'User ID' }),
                        username: t.String({ description: 'User username' }),
                        email: t.String({ description: 'User email' }),
                    }),
                }),
                400: t.Object({
                    message: t.String({ description: 'Missing required fields' }),
                }),
                500: t.Object({
                    message: t.String({ description: 'Failed to create user' }),
                }),
            },
        }
    );

    // Get all users
    app.get(
        '/users',
        async () => {
            try {
                const users = await getUsers();
                return { status: 200, data: users };
            } catch (error) {
                return { status: 500, message: 'Failed to retrieve users' };
            }
        },
        {
            description: 'Get a list of all users',
            response: {
                200: t.Object({
                    data: t.Array(
                        t.Object({
                            id: t.String({ description: 'User ID' }),
                            username: t.String({ description: 'User username' }),
                            email: t.String({ description: 'User email' }),
                        })
                    ),
                }),
                500: t.Object({
                    message: t.String({ description: 'Failed to retrieve users' }),
                }),
            },
        }
    );

    // Delete a user by ID
    app.delete(
        '/users/:id',
        async ({ params }) => {
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
        },
        {
            description: 'Delete a user by ID',
            params: t.Object({
                id: t.String({ description: 'The ID of the user to delete' }),
            }),
            response: {
                200: t.Object({
                    message: t.String({ description: 'Success message' }),
                }),
                400: t.Object({
                    message: t.String({ description: 'Error message when ID is missing' }),
                }),
                500: t.Object({
                    message: t.String({ description: 'Error message for internal server errors' }),
                }),
            },
        }
    );
};
