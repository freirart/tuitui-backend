import { Request, Response } from "express";
import TagModel from "../models/tag";

const { PROJECT_DOC } = process.env;

export async function create(request: Request, response: Response) {
  const { tagName } = request.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      tagName
    });

    if (result.yes) {
      return response.status(400).json({
        error: `No ${result.whichOne} provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const createdTag = await TagModel.create({ tagName });
    createdTag.save();

    response.status(201).send({ status: "Registration done." });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Registration failed." });
  }

  return response.status(200).send({ msg: "ok" });
}

export async function search(request: Request, response: Response) {
  const { tagName } = request.body;

  try {
    const existingTags = await TagModel.find({ tagName: {"$regex": new RegExp(tagName)} });
    return response.status(200).send({ tags: existingTags || [] });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Something went wrong." });
  }
}