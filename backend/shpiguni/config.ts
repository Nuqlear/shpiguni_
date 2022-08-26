import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    MONGOCONN: process.env.MONGOCONN,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
};
export default config;
