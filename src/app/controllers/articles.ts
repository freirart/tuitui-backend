import { Request, Response } from "express";
import { Types } from "mongoose";

import { ArticleModel } from "../models/article";

import { isThereAnyBodyParamUndefined } from "../utils/index";

const { PROJECT_DOC } = process.env;

export const create = async (req: Request, res: Response) => {
  const { author, title, content, tags } = req.body;

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
      return res.status(400).json({ message: "Invalid article id" });
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
          res.status(401);
        }
      } else {
        res.status(403);
      }
    } else {
      res.status(401);
    }

    return res.json({ message: defaultErrorMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// export async function search(request: Request, response: Response) {
//   const { tagName } = request.query;

//   try {
//     const result = isThereAnyBodyParamUndefined({
//       tagName,
//     });

//     if (result.yes) {
//       return response.status(400).json({
//         message: `No '${result.whichOne}' provided.`,
//         documentation: PROJECT_DOC,
//       });
//     }

//     const existingTags = await TagModel.getTagBasedOnItsName(tagName as string);

//     response.status(200).send({ tags: existingTags || [] });
//   } catch (err) {
//     console.log(err);
//     response.status(500).json({ message: "Something went wrong." });
//   }

//   return response;
// }