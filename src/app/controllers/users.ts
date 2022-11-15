import { Request, Response } from "express";

import { UserModel } from "../models/user";

import { isThereAnyBodyParamUndefined } from "../utils";

const { PROJECT_DOC } = process.env;

export const signUp = async (req: Request, res: Response) => {
  const { username, password, description, userEmail } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      username,
      password,
      description,
      userEmail,
    });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const isExistingUser = await UserModel.findOne({ userEmail }).exec();

    if (isExistingUser) {
      return res.status(400).json({
        message: "User already exists.",
        documentation: PROJECT_DOC,
      });
    }

    const user = await UserModel.create({
      username,
      password,
      description,
      userEmail,
    });

    user.save();

    req.userId = user._id;
    res
      .status(201)
      .json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }

  return res;
};

export const signIn = async (req: Request, res: Response) => {
  const { userEmail, password } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({ userEmail, password });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const user = await UserModel.findOne({ userEmail }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "User does not exist.",
        documentation: PROJECT_DOC,
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        message: "Wrong password.",
        documentation: PROJECT_DOC,
      });
    }

    req.userId = user._id;
    res
      .status(200)
      .json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't sign in." });
  }

  return res;
};

export const remove = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const existingUser = await UserModel.findById(userId);

    if (existingUser && !existingUser.isDeleted) {
      existingUser.isDeleted = true;
      existingUser.save();

      return res.status(200).json({ message: "Successfully deleted." });
    }

    return res.status(401).json({ message: "Can't delete this user." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
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
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
