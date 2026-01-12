import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Course } from "../models/course.model.js";

const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    if (existingEnrollment) {
        throw new ApiError(400, "You are already enrolled in this course");
    }

    // Create enrollment with paid amount
    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        paidAmount: course.price || 0,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, enrollment, "Enrolled successfully"));
});

const getStudentEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate({
            path: "course",
            populate: {
                path: "instructor",
                select: "name email",
            },
        })
        .sort({ enrolledAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, enrollments, "Enrollments fetched successfully"));
});

const checkEnrollmentStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isEnrolled: !!enrollment }, "Enrollment status checked"));
});

const markLessonComplete = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    });

    if (!enrollment) {
        throw new ApiError(404, "You are not enrolled in this course");
    }

    // Check if lesson already completed
    if (!enrollment.progress.completedLessons.includes(lessonId)) {
        enrollment.progress.completedLessons.push(lessonId);
        await enrollment.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, enrollment, "Lesson marked as complete"));
});

const getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    }).populate({
        path: "course",
        populate: {
            path: "sections",
            populate: {
                path: "lessons",
            },
        },
    });

    if (!enrollment) {
        throw new ApiError(404, "You are not enrolled in this course");
    }

    // Calculate total lessons
    let totalLessons = 0;
    enrollment.course?.sections?.forEach((section) => {
        totalLessons += section.lessons?.length || 0;
    });

    const completedCount = enrollment.progress.completedLessons?.length || 0;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, {
            completedLessons: enrollment.progress.completedLessons,
            totalLessons,
            completedCount,
            progressPercentage,
            isCompleted: enrollment.progress.isCompleted
        }, "Progress fetched successfully"));
});

const completeCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    }).populate({
        path: "course",
        populate: {
            path: "sections",
            populate: {
                path: "lessons",
            },
        },
    });

    if (!enrollment) {
        throw new ApiError(404, "You are not enrolled in this course");
    }

    // Calculate total lessons
    let totalLessons = 0;
    enrollment.course.sections?.forEach((section) => {
        totalLessons += section.lessons?.length || 0;
    });

    // Check if all lessons are completed
    if (enrollment.progress.completedLessons.length < totalLessons) {
        throw new ApiError(400, `Please complete all ${totalLessons} lessons first. You have completed ${enrollment.progress.completedLessons.length} lessons.`);
    }

    // Mark course as completed and generate certificate
    enrollment.progress.isCompleted = true;
    
    if (!enrollment.certificate.issued) {
        enrollment.certificate.issued = true;
        enrollment.certificate.issuedAt = new Date();
        enrollment.certificate.certificateId = enrollment.generateCertificateId();
    }

    await enrollment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, enrollment, "Course completed! Certificate generated."));
});

const getCertificate = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
    })
    .populate("student", "name email")
    .populate({
        path: "course",
        select: "title category instructor",
        populate: {
            path: "instructor",
            select: "name",
        },
    });

    if (!enrollment) {
        throw new ApiError(404, "You are not enrolled in this course");
    }

    if (!enrollment.certificate.issued) {
        throw new ApiError(400, "Certificate not yet issued. Please complete the course first.");
    }

    const certificateData = {
        certificateId: enrollment.certificate.certificateId,
        issuedAt: enrollment.certificate.issuedAt,
        studentName: enrollment.student.name,
        studentEmail: enrollment.student.email,
        courseName: enrollment.course.title,
        courseCategory: enrollment.course.category,
        instructorName: enrollment.course.instructor?.name,
        completedAt: enrollment.certificate.issuedAt,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, certificateData, "Certificate fetched successfully"));
});

const verifyCertificate = asyncHandler(async (req, res) => {
    const { certificateId } = req.params;

    const enrollment = await Enrollment.findOne({
        "certificate.certificateId": certificateId,
    })
    .populate("student", "name")
    .populate({
        path: "course",
        select: "title instructor",
        populate: {
            path: "instructor",
            select: "name",
        },
    });

    if (!enrollment) {
        throw new ApiError(404, "Invalid certificate ID");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            valid: true,
            studentName: enrollment.student.name,
            courseName: enrollment.course.title,
            instructorName: enrollment.course.instructor?.name,
            issuedAt: enrollment.certificate.issuedAt,
            certificateId: enrollment.certificate.certificateId,
        }, "Certificate verified successfully"));
});

// Get all students enrolled in instructor's courses
const getInstructorStudents = asyncHandler(async (req, res) => {
    const instructorId = req.user._id;

    // First get all courses by this instructor
    const instructorCourses = await Course.find({ instructor: instructorId }).select("_id title");
    const courseIds = instructorCourses.map(course => course._id);

    if (courseIds.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, { students: [], stats: { total: 0, completed: 0, inProgress: 0 } }, "No courses found"));
    }

    // Get all enrollments for these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate("student", "name email createdAt")
        .populate({
            path: "course",
            select: "title sections",
            populate: {
                path: "sections",
                populate: {
                    path: "lessons"
                }
            }
        })
        .sort({ enrolledAt: -1 });

    // Format the data with progress calculation
    const students = enrollments.map(enrollment => {
        // Calculate total lessons
        let totalLessons = 0;
        enrollment.course?.sections?.forEach(section => {
            totalLessons += section.lessons?.length || 0;
        });

        const completedLessons = enrollment.progress?.completedLessons?.length || 0;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
            _id: enrollment._id,
            student: enrollment.student,
            course: {
                _id: enrollment.course?._id,
                title: enrollment.course?.title
            },
            enrolledAt: enrollment.enrolledAt,
            progress: progressPercentage,
            isCompleted: enrollment.progress?.isCompleted || false,
            completedLessons,
            totalLessons
        };
    });

    // Calculate stats
    const stats = {
        total: students.length,
        completed: students.filter(s => s.isCompleted).length,
        inProgress: students.filter(s => !s.isCompleted && s.progress > 0).length
    };

    return res
        .status(200)
        .json(new ApiResponse(200, { students, stats }, "Instructor students fetched successfully"));
});

// Get instructor earnings
const getInstructorEarnings = asyncHandler(async (req, res) => {
    const instructorId = req.user._id;

    // Get all courses by instructor
    const courses = await Course.find({ instructor: instructorId }).select("_id title price");
    const courseIds = courses.map(c => c._id);

    // Get all enrollments for instructor's courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
        .populate("student", "name email")
        .populate("course", "title price")
        .sort({ enrolledAt: -1 });

    // Calculate total earnings
    const totalEarnings = enrollments.reduce((sum, e) => sum + (e.paidAmount || e.course?.price || 0), 0);

    // Calculate this month's earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnrollments = enrollments.filter(e => new Date(e.enrolledAt) >= startOfMonth);
    const thisMonthEarnings = thisMonthEnrollments.reduce((sum, e) => sum + (e.paidAmount || e.course?.price || 0), 0);

    // Calculate last month's earnings for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthEnrollments = enrollments.filter(e => {
        const date = new Date(e.enrolledAt);
        return date >= startOfLastMonth && date <= endOfLastMonth;
    });
    const lastMonthEarnings = lastMonthEnrollments.reduce((sum, e) => sum + (e.paidAmount || e.course?.price || 0), 0);

    // Calculate percentage change
    const percentChange = lastMonthEarnings > 0 
        ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
        : thisMonthEarnings > 0 ? 100 : 0;

    // Get monthly earnings for chart (last 6 months)
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthName = monthStart.toLocaleString('default', { month: 'short' });
        
        const monthEnrollments = enrollments.filter(e => {
            const date = new Date(e.enrolledAt);
            return date >= monthStart && date <= monthEnd;
        });
        
        const earnings = monthEnrollments.reduce((sum, e) => sum + (e.paidAmount || e.course?.price || 0), 0);
        monthlyEarnings.push({ month: monthName, earnings, enrollments: monthEnrollments.length });
    }

    // Format recent transactions
    const recentTransactions = enrollments.slice(0, 10).map(e => ({
        _id: e._id,
        studentName: e.student?.name,
        studentEmail: e.student?.email,
        courseName: e.course?.title,
        amount: e.paidAmount || e.course?.price || 0,
        date: e.enrolledAt
    }));

    return res.status(200).json(new ApiResponse(200, {
        totalEarnings,
        thisMonthEarnings,
        lastMonthEarnings,
        percentChange,
        totalStudents: enrollments.length,
        monthlyEarnings,
        recentTransactions
    }, "Earnings fetched successfully"));
});

export { enrollCourse, getStudentEnrollments, checkEnrollmentStatus, markLessonComplete, getCourseProgress, completeCourse, getCertificate, verifyCertificate, getInstructorStudents, getInstructorEarnings };
