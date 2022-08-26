import { conn } from './client';

const userTableName = "sh_user";

export interface User {
    id: string,
    username: string,
    color: string,
}

export async function registerUser(user: User) {
    const res = await conn.collection(userTableName).insertOne(user);
    return res;
}
