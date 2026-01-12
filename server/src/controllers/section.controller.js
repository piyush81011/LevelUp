import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Section } from "../models/section.model.js";
import { Course } from "../models/course.model.js";

const createSection = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "Section title is required");
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to modify this course");
    }

    // Get current sections count to determine order
    const sectionCount = await Section.countDocuments({ courseId });

    const section = await Section.create({
        courseId,
        title,
        order: sectionCount + 1,
    });

    // Add section to course
    await Course.findByIdAndUpdate(courseId, {
        $push: { sections: section._id },
    });

    return res
        .status(201)
        .json(new ApiResponse(201, section, "Section created successfully"));
});

const updateSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const { title } = req.body;

    const section = await Section.findByIdAndUpdate(
        sectionId,
        { title },
        { new: true }
    );

    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, section, "Section updated successfully"));
});

const deleteSection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    const section = await Section.findById(sectionId);
    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    await Section.findByIdAndDelete(sectionId);

    // Remove from course
    await Course.findByIdAndUpdate(section.courseId, {
        $pull: { sections: sectionId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Section deleted successfully"));
});

export { createSection, updateSection, deleteSection };
