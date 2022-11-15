import { Request, Response } from "express";

import { TagModel } from "../models/tag";

import { isThereAnyBodyParamUndefined } from "../utils/index";

const { PROJECT_DOC } = process.env;

export async function create(request: Request, response: Response) {
  const { tagName } = request.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      tagName,
    });

    if (result.yes) {
      return response.status(400).json({
        error: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const isTagAlreadyCreated = await TagModel.getTagBasedOnItsName(
      tagName as string
    );

    if (isTagAlreadyCreated) {
      return response.status(400).json({
        error: "Tag is already created",
        documentation: PROJECT_DOC,
      });
    }

    const createdTag = await TagModel.create({ tagName });
    createdTag.save();

    response.status(201).json({ status: "Registration done." });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Registration failed." });
  }

  return response;
}

export async function search(request: Request, response: Response) {
  const { tagName } = request.query;

  try {
    const result = isThereAnyBodyParamUndefined({
      tagName,
    });

    if (result.yes) {
      return response.status(400).json({
        error: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const existingTags = await TagModel.getTagBasedOnItsName(tagName as string);

    response.status(200).json({ tags: existingTags || [] });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Something went wrong." });
  }

  return response;
}
