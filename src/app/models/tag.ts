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
    const objCopy = JSON.parse(JSON.stringify(obj));

    delete objCopy["__v"];

    return objCopy;
  }

  public getDocument(this: DocumentType<TagClass>) {
    const document = { ...this.toJSON() };

    return TagClass.removeUnusedKeysFromObj(document);
  }

  public static async getTagBasedOnItsName(
    this: ReturnModelType<typeof TagClass>,
    tagName: string,
    shouldBeExact = false
  ) {
    const filter = tagName
      ? {
        tagName: { $regex: new RegExp(tagName, shouldBeExact ? "i" : "gi") },
      }
      : {};

    const foundTags = await this.find(filter);

    const formattedTags = foundTags.map(tag => TagClass.removeUnusedKeysFromObj(tag));

    return formattedTags;
  }
}

export const TagModel = getModelForClass(TagClass, {
  existingConnection: connection,
  options: { customName: "tags" },
});
