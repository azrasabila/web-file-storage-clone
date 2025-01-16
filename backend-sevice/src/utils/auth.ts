import jwt from 'jsonwebtoken';

const secret = 'your-secret-key';

export const generateToken = (userId: number) => {
    return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret);
};
