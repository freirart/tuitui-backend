import { DocumentType, getModelForClass, prop, Ref } from "@typegoose/typegoose";
import connection from "../../database";
import { UserClass } from "./user";

export class ArticleClass {
  @prop({ ref: () => UserClass, required: true })
  public ownerId!: Ref<UserClass>;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public content!: string;

  @prop({ ref: () => UserClass })
  public likes?: Ref<UserClass>[];

  public getDocument(this: DocumentType<ArticleClass>) {
    const document = { ...this.toJSON() };

    delete document["__v"];

    return document;
  }
}

const ArticleModel = getModelForClass(ArticleClass, {
  existingConnection: connection,
  options: { customName: "articles" }
});

export default ArticleModel;