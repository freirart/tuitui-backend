import mongoose from "mongoose";

const { NODE_ENV, MONGODB_URI, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT } =
  process.env;

let connectString = MONGODB_URI;

if (NODE_ENV !== "PROD") {
  connectString = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`;
}

console.log({ NODE_ENV, connectString });

const conn = mongoose.createConnection(connectString, { dbName: "tuitui" });

export default conn;
