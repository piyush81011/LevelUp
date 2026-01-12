import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String, // URL to video file
        required: true,
    },
    content: {
        type: String, // Markdown notes
    },
    duration: {
        type: Number, // In seconds/minutes
    },
    isFreePreview: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        required: true,
    },
});

export const Lesson = mongoose.model("Lesson", lessonSchema);
