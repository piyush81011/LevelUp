import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const createCourse = asyncHandler(async (req, res) => {
    const { title, description, category, price, thumbnail } = req.body;

    if (
        [title, description, category, price, thumbnail].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const course = await Course.create({
        title,
        description,
        category,
        price,
        thumbnail,
        instructor: req.user?._id,
        status: "draft",
    });

    if (!course) {
        throw new ApiError(500, "Something went wrong while creating the course");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, course, "Course created Successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ status: "published" })
        .populate("instructor", "name email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const getMyCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ instructor: req.user._id })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "Your courses fetched successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this course");
    }

    await Course.findByIdAndDelete(courseId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Course deleted successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
        .populate("instructor", "name email")
        .populate({
            path: "sections",
            populate: {
                path: "lessons",
                model: "Lesson"
            }
        });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, description, category, price, thumbnail, status } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this course");
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                title: title || course.title,
                description: description || course.description,
                category: category || course.category,
                price: price !== undefined ? price : course.price,
                thumbnail: thumbnail || course.thumbnail,
                status: status || course.status,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
});

export { createCourse, getAllCourses, getMyCourses, deleteCourse, getCourseById, updateCourse };
