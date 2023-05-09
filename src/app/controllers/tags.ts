import { Request, Response } from "express";

import { TagModel } from "../models/tag";

import { isFilledArray } from "../utils/index";

const { PROJECT_DOC } = process.env;

export const tagCreation = async (tagList: string[]) => {
  let createdTags = 0;

  for (const tag of tagList) {
    const existingTags = await TagModel.getTagBasedOnItsName(tag as string, true);

    if (!isFilledArray(existingTags)) {
      const createdTag = await TagModel.create({ tagName: tag });
      createdTag.save();
      createdTags += 1;
    }
  }

  return createdTags;
};

export const create = async (req: Request, res: Response) => {
  const { tagList } = req.body;

  try {
    if (!isFilledArray(tagList)) {
      return res.status(400).json({
        message: "Body should contain a 'tagList' array value.",
        documentation: PROJECT_DOC
      });
    }

    tagCreation(tagList);

    return res.status(201).json({ message: "Registration done." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }

  return res;
};

export const search = async (req: Request, res: Response) => {
  const { tagName } = req.query;

  try {
    const existingTags = await TagModel.getTagBasedOnItsName(String(tagName || ""));

    res.status(200).json({ data: existingTags || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }

  return res;
};
