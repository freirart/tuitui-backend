import { Router } from "express";
import * as tagsController from "../controllers/tags";

const router = Router();

router.get("/tag", tagsController.search);
router.post("/tag", tagsController.create);

module.exports = router;
