import { Router } from "express";

import * as tagsController from "../controllers/tags";

import { validateToken } from "../auth";

const router = Router();

router.use(validateToken);

router.get("/", tagsController.search);
router.post("/", tagsController.create);

export default router;
