import mongoose from "mongoose";

const connectString =
  process.env.NODE_ENV === "TEST"
    ? `mongodb://localhost/${Date.now()}`
    : process.env.MONGODB_URI;

const conn = mongoose.createConnection(connectString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

export default conn;
