import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import connection from "../../database";

export class TagClass {
  @prop({ required: true })
  public tagName!: string;

  public getDocument(this: DocumentType<TagClass>) {
    const document = { ...this.toJSON() };

    delete document["__v"];

    return document;
  }
}

const TagModel = getModelForClass(TagClass, {
  existingConnection: connection,
  options: { customName: "tags" },
});
  
export default TagModel;