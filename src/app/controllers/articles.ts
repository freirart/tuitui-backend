import { Request, Response } from "express";

import { ArticleModel } from "../models/article";

import { isThereAnyBodyParamUndefined } from "../utils/index";

const { PROJECT_DOC } = process.env;

export async function create(request: Request, response: Response) {
  const { author, title, content, tags } = request.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      author,
      title,
      content,
      tags,
    });

    if (result.yes) {
      return response.status(400).json({
        error: `No '${result.whichOne}' provided.`,
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

    response.status(201).json({ article: createdArticle.getDocument() });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Registration failed." });
  }

  return response;
}

// export async function search(request: Request, response: Response) {
//   const { tagName } = request.query;

//   try {
//     const result = isThereAnyBodyParamUndefined({
//       tagName,
//     });

//     if (result.yes) {
//       return response.status(400).json({
//         error: `No '${result.whichOne}' provided.`,
//         documentation: PROJECT_DOC,
//       });
//     }

//     const existingTags = await TagModel.getTagBasedOnItsName(tagName as string);

//     response.status(200).send({ tags: existingTags || [] });
//   } catch (err) {
//     console.log(err);
//     response.status(500).json({ error: "Something went wrong." });
//   }

//   return response;
// }
