import { Handler } from 'elysia';
import { verifyToken } from '../utils/auth';

export const authMiddleware: Handler = async (context) => {
    const authHeader = context.headers // Retrieve the Authorization header
    const token = authHeader['authorization'] // Extract the Bearer token

    if (!token) {
        // Respond with a 401 Unauthorized error
        // context.status = 401;
        context.body = { message: 'Unauthorized: No token provided' };
        return; // Stop further middleware or handler execution
    }

    try {
        const user = verifyToken(token); // Verify and decode the token
        // context['user'] = user; // Attach the user to the context
    } catch (err) {
        // Respond with a 401 Unauthorized error for invalid token
        // context.status = 401;
        context.body = { message: 'Unauthorized: Invalid token' };
    }
};
