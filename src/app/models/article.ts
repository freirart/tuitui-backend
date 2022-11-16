import {
  DocumentType,
  getModelForClass,
  prop,
  Ref,
  Severity,
  pre,
} from "@typegoose/typegoose";
import connection from "../../database";
import { UserClass } from "./user";
import { TagClass } from "./tag";

@pre<ArticleClass>(
  "save",
  function (this: DocumentType<ArticleClass>, next: Function) {
    this.lastModifiedAt = new Date();
    next();
  }
)
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

  @prop({ default: false })
  public isDeleted?: boolean;

  @prop({ required: true, default: Date.now() })
  public createdAt!: Date;

  @prop({ required: true, default: Date.now() })
  public lastModifiedAt!: Date;

  public getDocument(this: DocumentType<ArticleClass>) {
    const document = { ...this.toJSON() };

    const keysToDelete = ["__v", "createdAt", "lastModifiedAt", "isDeleted"];

    for (const key of keysToDelete) {
      if (key in document) {
        delete document[key];
      }
    }

    return document;
  }
}

export const ArticleModel = getModelForClass(ArticleClass, {
  existingConnection: connection,
  options: { customName: "articles" },
});
