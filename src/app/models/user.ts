import {
  DocumentType,
  getModelForClass,
  pre,
  prop,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connection from "../../database";

@pre<UserClass>(
  "save",
  async function (this: DocumentType<UserClass>, next: Function) {
    if (this.password) {
      try {
        bcrypt.getRounds(this.password);
      } catch (err) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
      }
    }

    this.lastModifiedAt = new Date();

    next();
  }
)
export class UserClass {
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

  @prop({ required: true, default: Date.now() })
  public lastModifiedAt!: Date;

  @prop({ default: false })
  public isDeleted?: boolean;

  public generateToken(this: DocumentType<UserClass>) {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
  }

  public async checkPassword(this: DocumentType<UserClass>, password: string) {
    return await bcrypt.compare(password, this.password);
  }

  public getDocument(this: DocumentType<UserClass>) {
    const document = { ...this.toJSON() };

    const keysToDelete = [
      "password",
      "__v",
      "createdAt",
      "isDeleted",
      "lastModifiedAt",
    ];

    for (const key of keysToDelete) {
      if (key in document) {
        delete document[key];
      }
    }

    return document;
  }
}

export const UserModel = getModelForClass(UserClass, {
  existingConnection: connection,
  options: { customName: "users" },
});
