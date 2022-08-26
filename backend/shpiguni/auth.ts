import jwt from 'jsonwebtoken';


export function decodeAuthToken(req) {
    const decoded = jwt.decode(req.headers['authorization']);
    return decoded;
}
