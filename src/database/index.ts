import mongoose from "mongoose";

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT } = process.env;

const connectString =
  process.env.NODE_ENV === "TEST"
    ? `mongodb://localhost/${Date.now()}`
    : process.env.NODE_ENV !== "PROD"
      ? `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`
      : process.env.MONGODB_URI;

const conn = mongoose.createConnection(connectString);

export default conn;
