import { Request, Response } from "express";

import { TagModel } from "../models/tag";

import { isThereAnyBodyParamUndefined, isFilledArray } from "../utils/index";

const { PROJECT_DOC } = process.env;

export const create = async (req: Request, res: Response) => {
  const { tagName } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      tagName,
    });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const existingTags = await TagModel.getTagBasedOnItsName(
      tagName as string,
      true
    );

    if (isFilledArray(existingTags)) {
      return res.status(400).json({
        message: "Tag is already created",
        documentation: PROJECT_DOC,
      });
    }

    const createdTag = await TagModel.create({ tagName });
    createdTag.save();

    res.status(201).json({ message: "Registration done." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }

  return res;
};

export const search = async (req: Request, res: Response) => {
  const { tagName } = req.query;

  try {
    const existingTags = await TagModel.getTagBasedOnItsName(
      String(tagName ? tagName : "")
    );

    res.status(200).json({ data: existingTags || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }

  return res;
};
