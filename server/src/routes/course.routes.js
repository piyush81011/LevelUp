import { Router } from "express";
import { createCourse, getAllCourses, getMyCourses, deleteCourse, getCourseById, updateCourse } from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCourses).post(verifyJWT, createCourse);
router.route("/my-courses").get(verifyJWT, getMyCourses);
router.route("/:courseId").get(getCourseById).put(verifyJWT, updateCourse).delete(verifyJWT, deleteCourse);

export default router;
