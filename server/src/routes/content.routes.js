import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSection, updateSection, deleteSection } from "../controllers/section.controller.js";
import { createLesson, updateLesson, deleteLesson } from "../controllers/lesson.controller.js";

const router = Router();

router.use(verifyJWT);

// Section Routes
router.route("/course/:courseId/section").post(createSection);
router.route("/section/:sectionId").patch(updateSection).delete(deleteSection);

// Lesson Routes
router.route("/section/:sectionId/lesson").post(createLesson);
router.route("/lesson/:lessonId").patch(updateLesson).delete(deleteLesson);

export default router;
