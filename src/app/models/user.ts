import { NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createSchema, Type, typedModel, ExtractDoc } from "ts-mongoose";
import connection from "../../database";

const UserSchema = createSchema({
  username: Type.string({ required: true }),
  password: Type.string({ required: true, select: false }),
  description: Type.string(),
  userEmail: Type.string({ required: true, unique: true }),
  createdAt: Type.date({ default: Date.now() }),
  ...({} as {
    generateToken: () => string;
    checkPassword: (password: string) => Promise<boolean>;
  }),
});

type UserDoc = ExtractDoc<typeof UserSchema>;

UserSchema.pre("save", async function (this: UserDoc, next: NextFunction) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

UserSchema.methods.generateToken = function generateToken(this: UserDoc) {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
};

UserSchema.methods.checkPassword = function checkPassword(
  this: UserDoc,
  password: string
) {
  return bcrypt.compare(password, this.password);
};

export const User = typedModel(
  "User",
  UserSchema,
  undefined,
  undefined,
  {},
  connection
);
