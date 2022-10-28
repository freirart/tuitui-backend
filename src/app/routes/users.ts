import * as express from "express";
const router = express.Router();

const usersController = require("../controllers/users");

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);

module.exports = router;
