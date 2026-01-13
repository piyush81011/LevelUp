import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCourseMessages, getChatUsers, getInstructorConversations } from "../controllers/chat.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/conversations").get(getInstructorConversations);
router.route("/:courseId").get(getCourseMessages);
router.route("/users/:courseId").get(getChatUsers);
router.route("/users/:courseId").get(getChatUsers);

export default router;
