import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { enrollCourse, getStudentEnrollments, checkEnrollmentStatus, markLessonComplete, getCourseProgress, completeCourse, getCertificate, verifyCertificate, getInstructorStudents, getInstructorEarnings } from "../controllers/enrollment.controller.js";

const router = Router();

// Public route for certificate verification
router.route("/verify/:certificateId").get(verifyCertificate);

router.use(verifyJWT); // Apply auth middleware to all routes below

router.route("/my-enrollments").get(getStudentEnrollments);
router.route("/instructor/students").get(getInstructorStudents);
router.route("/instructor/earnings").get(getInstructorEarnings);
router.route("/:courseId").post(enrollCourse);
router.route("/:courseId/status").get(checkEnrollmentStatus);
router.route("/:courseId/progress").get(getCourseProgress);
router.route("/:courseId/lesson/:lessonId/complete").post(markLessonComplete);
router.route("/:courseId/complete").post(completeCourse);
router.route("/:courseId/certificate").get(getCertificate);

export default router;
