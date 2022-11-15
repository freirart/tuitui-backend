import { Router } from "express";

import * as articlesController from "../controllers/articles";

import { validateToken } from "../auth";

const router = Router();

router.use(validateToken);

router.post("/", articlesController.create);
router.delete("/", articlesController.remove);
router.put("/", articlesController.edit);
// router.post("/", articlesController.search);

export default router;
