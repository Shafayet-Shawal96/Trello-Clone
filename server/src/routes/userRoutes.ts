import express from "express";
import * as UserController from "../controllers/userControllers";

const router = express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/loggedinuser", UserController.isLoggedIn);

export default router;
