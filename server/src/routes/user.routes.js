import { Router } from "express";
import { registerUser, loginUser, getAllUsers, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// Protected routes
router.route("/").get(verifyJWT, getAllUsers);

export default router;
