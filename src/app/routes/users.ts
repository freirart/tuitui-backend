import { Router } from "express";

import * as usersController from "../controllers/users";

import { validateToken } from "../auth";

const router = Router();

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);

// below this line all endpoints will require Bearer token auth
router.use(validateToken);

router.delete("/", usersController.remove);
router.put("/", usersController.edit);
router.get("/", usersController.search);

export default router;
