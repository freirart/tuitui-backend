import {
  DocumentType,
  getModelForClass,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import connection from "../../database";
import { UserClass } from "./user";
import { TagClass } from "./tag";

export class ArticleClass {
  @prop({ ref: () => UserClass, required: true })
  public author!: Ref<UserClass>;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public content!: string;

  // @prop({ ref: () => UserClass })
  // public likes?: Ref<UserClass>[];

  @prop({ allowMixed: Severity.ALLOW })
  public tags?: TagClass[];

  public getDocument(this: DocumentType<ArticleClass>) {
    const document = { ...this.toJSON() };

    delete document["__v"];

    return document;
  }
}

export const ArticleModel = getModelForClass(ArticleClass, {
  existingConnection: connection,
  options: { customName: "articles" },
});
