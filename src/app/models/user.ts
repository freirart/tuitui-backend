import { NextFunction } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema, model } = require("../../database");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  description: {
    type: String
  },
  userEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function(this: typeof UserSchema, next: NextFunction) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  
  next();
});

const User = model("User", UserSchema);

User.prototype.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
};

User.prototype.checkPassword = function(password: string) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;

export {};