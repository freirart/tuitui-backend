import mongoose from "mongoose";

const { NODE_ENV, MONGODB_URI, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT } =
  process.env;

let connectString = MONGODB_URI;

if (NODE_ENV !== "PROD") {
  connectString = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`;
}

const conn = mongoose.createConnection(connectString);

export default conn;
