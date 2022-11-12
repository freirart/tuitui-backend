import { Router } from "express";
import * as tagsController from "../controllers/tags";

const router = Router();

router.get("/", tagsController.search);
router.post("/", tagsController.create);

export default router;
