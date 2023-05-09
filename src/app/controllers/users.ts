import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { validateParams } from "../utils";

const { PROJECT_DOC } = process.env;

export const standardErrorHandler = (err: any, res: Response) => {
  console.error(err);
  return res.status(500).json({ message: "Something went wrong." });
};

/**
 * Cria um novo usuário.
 */
export const signUp = async (req: Request, res: Response) => {
  const { username, password, description, userEmail } = req.body;

  try {
    const { valid, message } = validateParams({ username, password, description, userEmail });

    if (!valid) {
      return res.status(400).json({ message, documentation: PROJECT_DOC });
    }

    const existingUser = await UserModel.findOne({
      userEmail,
      $and: [{ isDeleted: { $ne: true } }]
    }).exec();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
        documentation: PROJECT_DOC
      });
    }

    const user = await UserModel.create({ username, password, description, userEmail });
    user.save();

    req.userId = user._id;
    return res.status(201).json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    return standardErrorHandler(err, res);
  }
};

/**
 * Realiza o login do usuário.
 */
export const signIn = async (req: Request, res: Response) => {
  const { userEmail, password } = req.body;

  try {
    const { valid, message } = validateParams({ userEmail, password });

    if (!valid) {
      return res.status(400).json({ message, documentation: PROJECT_DOC });
    }

    const user = await UserModel.findOne({
      userEmail,
      $and: [{ isDeleted: { $ne: true } }]
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User does not exist.",
        documentation: PROJECT_DOC
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        message: "Wrong password.",
        documentation: PROJECT_DOC
      });
    }

    req.userId = user._id;
    return res.status(200).json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    return standardErrorHandler(err, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const existingUser = await UserModel.findById(userId);

    if (existingUser && !existingUser.isDeleted) {
      existingUser.isDeleted = true;
      await existingUser.save();

      return res.status(200).json({ message: "Successfully deleted." });
    }

    return res.status(401).json({ message: "Can't delete this user." });
  } catch (err) {
    return standardErrorHandler(err, res);
  }
};

export const edit = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const existingUser = await UserModel.findById(userId);

    const expectedKeys = ["username", "description"];
    for (const key of expectedKeys) {
      if (key in req.body) {
        existingUser[key] = req.body[key];
      }
    }

    const updatedUser = await existingUser.save();
    return res.status(200).json({ updatedUser: updatedUser.getDocument() });
  } catch (err) {
    return standardErrorHandler(err, res);
  }
};

export const search = async (req: Request, res: Response) => {
  const { username, userEmail } = req.query;

  try {
    const { valid, message } = validateParams({ username, userEmail }, false);

    if (!valid) {
      return res.status(400).json({ message, documentation: PROJECT_DOC });
    }

    const andFilter = [];

    andFilter.push({ isDeleted: { $ne: true } });

    if (username) {
      andFilter.push({ username: { $regex: username, $options: "i" } });
    }

    if (userEmail) {
      andFilter.push({ userEmail });
    }

    const data = await UserModel.find({ $and: andFilter });

    return res.status(200).json({
      users: data.map((user) => user.getDocument()),
      count: data.length
    });
  } catch (err) {
    return standardErrorHandler(err, res);
  }
};
