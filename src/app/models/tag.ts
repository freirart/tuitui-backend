import {
  DocumentType,
  getModelForClass,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import connection from "../../database";

export class TagClass {
  @prop({ required: true })
  public tagName!: string;

  private static removeUnusedKeysFromObj(obj: object) {
    delete obj["__v"];

    return obj;
  }

  public getDocument(this: DocumentType<TagClass>) {
    const document = { ...this.toJSON() };

    return TagClass.removeUnusedKeysFromObj(document);
  }

  public static async getTagBasedOnItsName(
    this: ReturnModelType<typeof TagClass>,
    tagName: string
  ) {
    const foundTag = await this.findOne({
      tagName: { $regex: new RegExp(tagName, "i") },
    });

    if (foundTag) {
      return TagClass.removeUnusedKeysFromObj(foundTag);
    }

    return null;
  }
}

const TagModel = getModelForClass(TagClass, {
  existingConnection: connection,
  options: { customName: "tags" },
});

export default TagModel;
