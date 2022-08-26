import { MongoClient } from "mongodb";
import config from "../config";


export const client = new MongoClient(config.MONGOCONN);
export let conn = null

export async function connect() {
    await client.connect();
    conn = client.db(config.MONGO_DBNAME);
}

