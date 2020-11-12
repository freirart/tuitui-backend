const bcrypt = require('bcryptjs');
import { NextFunction } from 'express';

const { Schema, model } = require('../../database');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function(this: typeof UserSchema, next: NextFunction) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  
  next();
});

const User = model('User', UserSchema);

module.exports = User;

export {};