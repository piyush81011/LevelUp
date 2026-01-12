import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
        },
        lessons: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Section = mongoose.model("Section", sectionSchema);
