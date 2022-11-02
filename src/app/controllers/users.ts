import { Request, Response } from "express";
import { User } from "../models/user";

const { PROJECT_DOC } = process.env;

const isThereAnyBodyParamUndefined = require("../utils");

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
        error: `No ${result.whichOne} provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const isExistingUser = await User.findOne({ userEmail }).exec();

    if (isExistingUser) {
      return res.status(400).json({
        error: "User already exists.",
        documentation: PROJECT_DOC,
      });
    }

    const user = new User({
      username,
      password,
      description,
      userEmail,
    });

    user.save();

    req.userId = user._id;

    const createdUser = { ...user };
    delete createdUser.password;

    res.status(201).json({ user: createdUser, token: user.generateToken() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed." });
  }
};

// export const signIn = async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   try {
//     const result = isThereAnyBodyParamUndefined({ username, password });

//     if (result.yes) {
//       return res.status(400).json({
//         error: `No ${result.whichOne} provided.`,
//         documentation: PROJECT_DOC,
//       });
//     }

//     const user = await User.findOne({ username }).select("+password");
//     if (!user) {
//       return res.status(401).json({
//         error: "User does not exist.",
//         documentation: PROJECT_DOC,
//       });
//     }

//     if (!(await user.checkPassword(password))) {
//       return res.status(401).json({
//         error: "Wrong password.",
//         documentation: PROJECT_DOC,
//       });
//     }

//     req.userId = user._id;
//     res.status(200).json({ user, token: user.generateToken(req.userId) });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Couldn't sign in." });
//   }
// };
