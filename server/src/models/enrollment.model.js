import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const enrollmentSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        progress: {
            completedLessons: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Lesson",
                },
            ],
            isCompleted: {
                type: Boolean,
                default: false,
            },
        },
        certificate: {
            issued: {
                type: Boolean,
                default: false,
            },
            issuedAt: {
                type: Date,
            },
            certificateId: {
                type: String,
                unique: true,
                sparse: true,
            },
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Generate unique certificate ID
enrollmentSchema.methods.generateCertificateId = function () {
    const uniqueString = `${this.student}-${this.course}-${Date.now()}`;
    return crypto.createHash("sha256").update(uniqueString).digest("hex").substring(0, 16).toUpperCase();
};

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
