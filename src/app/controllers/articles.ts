import { Request, Response } from "express";
import { Types } from "mongoose";

import { ArticleModel } from "../models/article";
import { UserModel } from "../models/user";

import {
  areAllExpectedParamsUndefined,
  isFilledArray,
  isThereAnyBodyParamUndefined,
} from "../utils/index";

const { PROJECT_DOC } = process.env;

export const create = async (req: Request, res: Response) => {
  const { title, content, tags } = req.body;
  const { userId: author } = req;

  try {
    const result = isThereAnyBodyParamUndefined({
      author,
      title,
      content,
      tags,
    });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const createdArticle = await ArticleModel.create({
      author,
      title,
      content,
      tags,
    });
    createdArticle.save();

    res.status(201).json({ article: createdArticle.getDocument() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }

  return res;
};

export const remove = async (req: Request, res: Response) => {
  const { articleId } = req.query;
  const { userId } = req;

  try {
    const result = isThereAnyBodyParamUndefined({ articleId, userId });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    if (!Types.ObjectId.isValid(articleId as string)) {
      return res.status(400).json({ message: "Invalid article id." });
    }

    const existingArticle = await ArticleModel.findById(articleId);

    let defaultErrorMessage = "Can't delete this article";

    if (existingArticle) {
      const formattedUserId = String(userId);
      const articleAuthorId = existingArticle.author.toString();

      if (formattedUserId === articleAuthorId) {
        if (!existingArticle.isDeleted) {
          existingArticle.isDeleted = true;
          existingArticle.save();

          return res.status(200).json({ message: "Successfully deleted." });
        } else {
          defaultErrorMessage += ": article already deleted!";
          res.status(400);
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(400);
    }

    return res.json({ message: defaultErrorMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const edit = async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const { userId } = req;

  try {
    if (!Types.ObjectId.isValid(articleId as string)) {
      return res.status(400).json({ message: "Invalid article id." });
    }

    const existingArticle = await ArticleModel.findById(articleId);

    let defaultErrorMessage = "Can't edit this article";

    if (existingArticle) {
      const formattedUserId = String(userId);
      const articleAuthorId = existingArticle.author.toString();

      if (formattedUserId === articleAuthorId) {
        if (!existingArticle.isDeleted) {
          for (const key of Object.keys(req.body)) {
            if (
              key in existingArticle &&
              key !== undefined &&
              !Types.ObjectId.isValid(existingArticle[key])
            ) {
              existingArticle[key] = req.body[key];
            }
          }

          const updatedArticle = await existingArticle.save();
          return res
            .status(200)
            .json({ updatedArticle: updatedArticle.getDocument() });
        } else {
          defaultErrorMessage += ": article deleted!";
          res.status(400);
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(400);
    }

    return res.json({ message: defaultErrorMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const search = async (req: Request, res: Response) => {
  const { author, title, tags, id } = req.query;

  try {
    const result = areAllExpectedParamsUndefined({
      author,
      title,
      tags,
      id,
    });

    if (result.yes) {
      return res.status(400).json({
        message: result.message,
        documentation: PROJECT_DOC,
      });
    }

    const andFilter = [];

    if (id) {
      const formattedId = String(id).replace(/\s/gi, "");

      if (Types.ObjectId.isValid(formattedId)) {
        andFilter.push({ _id: formattedId });
      } else {
        return res.status(400).json({ message: "Invalid article id." });
      }
    }

    if (title) {
      andFilter.push({ title: new RegExp(title as string, "ig") });
    }

    if (tags) {
      try {
        const formattedTags = JSON.parse(tags as string);

        if (!isFilledArray(formattedTags)) {
          throw new Error("Provided tags are not a filled array");
        }

        andFilter.push({ "tags.tagName": { $in: formattedTags } });
      } catch (err) {
        console.error(err);
        return res.status(400).json({
          message: "Could not understand provided tags",
          documentation: PROJECT_DOC,
        });
      }
    }

    // there are no reasons to show deleted articles
    andFilter.push({ isDeleted: { $ne: true } });

    const data = await ArticleModel.find({ $and: andFilter }).populate(
      "author",
      "username",
      UserModel
    );

    let filteredData = data;

    if (author) {
      const authorRegex = new RegExp(author as string, "i");

      const desiredArticles = [];

      for (const article of data) {
        const userName = article.author["username"];
        const isValidArticle = authorRegex.test(userName);

        if (
          isValidArticle ||
          (isFilledArray(desiredArticles) &&
            desiredArticles.find((d) => d.author["username"] === userName))
        ) {
          desiredArticles.push(article);
        }
      }

      filteredData = desiredArticles;
    }

    return res
      .status(200)
      .json({ data: filteredData.map((d) => d.getDocument()) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong." });
  }

  return res;
};
