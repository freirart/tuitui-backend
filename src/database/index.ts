import mongoose from "mongoose";

const connectString =
  process.env.NODE_ENV === "TEST"
    ? `mongodb://localhost/${Date.now()}`
    : process.env.MONGODB_URI;

const conn = mongoose.createConnection(connectString);

export default conn;
