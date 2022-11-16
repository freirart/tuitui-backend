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

  @prop({ required: true, default: Date.now() })
  public createdAt: Date;

  private static removeUnusedKeysFromObj(obj: object) {
    const document = JSON.parse(JSON.stringify(obj));

    const keysToDelete = ["__v", "createdAt"];

    for (const key of keysToDelete) {
      if (key in document) {
        delete document[key];
      }
    }

    return document;
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

    const formattedTags = foundTags.map((tag) =>
      TagClass.removeUnusedKeysFromObj(tag)
    );

    return formattedTags;
  }
}

export const TagModel = getModelForClass(TagClass, {
  existingConnection: connection,
  options: { customName: "tags" },
});
