import { Router } from "express";
import * as usersController from "../controllers/users";

const router = Router();

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);

export default router;
