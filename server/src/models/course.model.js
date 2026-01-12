import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "published", "rejected"],
            default: "draft",
        },
        sections: [
            {
                type: Schema.Types.ObjectId,
                ref: "Section",
            },
        ],
        studentsEnrolled: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Course = mongoose.model("Course", courseSchema);
