import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Lesson } from "../models/lesson.model.js";
import { Section } from "../models/section.model.js";

const createLesson = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    const { title, videoUrl, content, isFreePreview } = req.body;

    if (!title || !videoUrl) {
        throw new ApiError(400, "Title and Video URL are required");
    }

    const section = await Section.findById(sectionId);
    if (!section) {
        throw new ApiError(404, "Section not found");
    }

    // Get current lessons count in this section
    const lessonCount = await Lesson.countDocuments({ sectionId });

    const lesson = await Lesson.create({
        sectionId,
        title,
        videoUrl,
        content,
        isFreePreview: isFreePreview || false,
        order: lessonCount + 1,
    });

    // Add lesson to section
    await Section.findByIdAndUpdate(sectionId, {
        $push: { lessons: lesson._id },
    });

    return res
        .status(201)
        .json(new ApiResponse(201, lesson, "Lesson created successfully"));
});

const updateLesson = asyncHandler(async (req, res) => {
    const { lessonId } = req.params;
    const { title, videoUrl, content, isFreePreview } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
        lessonId,
        {
            title,
            videoUrl,
            content,
            isFreePreview,
        },
        { new: true }
    );

    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, lesson, "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req, res) => {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }

    await Lesson.findByIdAndDelete(lessonId);

    // Remove from section
    await Section.findByIdAndUpdate(lesson.sectionId, {
        $pull: { lessons: lessonId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Lesson deleted successfully"));
});

export { createLesson, updateLesson, deleteLesson };
