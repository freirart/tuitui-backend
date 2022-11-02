import { NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getModelForClass,
  prop,
  DocumentType,
  pre,
} from "@typegoose/typegoose";
import connection from "../../database";

@pre<UserClass>(
  "save",
  async function (this: DocumentType<UserClass>, next: NextFunction) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
  }
)
class UserClass {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true, select: false })
  public password!: string;

  @prop()
  public description?: string;

  @prop({ required: true, unique: true })
  public userEmail!: string;

  @prop({ required: true, default: Date.now() })
  public createdAt!: Date;

  public generateToken(this: DocumentType<UserClass>) {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });
  }

  public checkPassword(this: DocumentType<UserClass>, password: string) {
    return bcrypt.compare(password, this.password);
  }
}

const UserModel = getModelForClass(UserClass, {
  existingConnection: connection,
  options: { customName: "users" },
});

export default UserModel;
