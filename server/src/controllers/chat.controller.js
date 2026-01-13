import mongoose from "mongoose";
import { Message } from "../models/message.model.js";

export const getCourseMessages = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { studentId } = req.query; // For instructor to view specific student chat
        const currentUserId = req.user._id;
        const currentUserRole = req.user.role; // Assuming role is available in req.user

        let query = { course: courseId };

        if (currentUserRole === "student") {
            // Student can only see their own messages (sent or received)
            query.$or = [
                { sender: currentUserId },
                { receiver: currentUserId }
            ];
        } else if (currentUserRole === "instructor" || currentUserRole === "admin") {
            // Instructor viewing specific student conversation
            if (studentId) {
                query.$or = [
                    { sender: studentId },
                    { receiver: studentId }
                ];
            }
            // If no studentId, maybe show recent messages? Or nothing?
            // For now, if no studentId provided, we might return empty or all (if they really want to oversee).
            // Let's return empty if no studentId is specified for specific conversation view to avoid noise.
            else {
                // query = { course: courseId }; // UNCOMMENT to see ALL messages (global view)
                // For 1-on-1 model, we probably only want specific conversation.
            }
        }

        const messages = await Message.find(query)
            .populate("sender", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
};

export const getChatUsers = async (req, res) => {
    try {
        const { courseId } = req.params;
        const currentUserId = req.user._id;

        // Find all unique users who have participated in chat for this course
        // We look at 'sender' field.
        const users = await Message.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: "$sender"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    avatar: "$userDetails.avatar"
                }
            }
        ]);

        // Filter out current user (instructor) from the list
        const students = users.filter(u => u._id.toString() !== currentUserId.toString());

        return res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error("Error fetching chat users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat users"
        });
    }
};

export const getInstructorConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // 1. Find all courses created by this instructor
        const instructorCourses = await mongoose.model("Course").find({ instructor: currentUserId }).select("_id title");
        const courseIds = instructorCourses.map(c => c._id);

        if (courseIds.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // 2. Aggregate messages in these courses to find unique students
        const conversations = await Message.aggregate([
            {
                $match: {
                    course: { $in: courseIds }
                }
            },
            {
                $group: {
                    _id: {
                        student: "$sender", // We assume sender is student roughly (or receiver)
                        course: "$course"
                    },
                    lastMessage: { $last: "$content" },
                    lastMessageTime: { $last: "$createdAt" }
                }
            },
            // Logic improvement: In a conversation, sender OR receiver could be student.
            // But usually we want to list students who engaged.
            // Simplify: Group by sender. If sender is Instructor, ignore.
            // If sender is Student, keep.
            {
                $match: {
                    "_id.student": { $ne: new mongoose.Types.ObjectId(currentUserId) }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.student",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            },
            {
                $unwind: "$studentDetails"
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id.course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $sort: { lastMessageTime: -1 }
            },
            {
                $project: {
                    _id: 0,
                    student: {
                        _id: "$studentDetails._id",
                        name: "$studentDetails.name",
                        email: "$studentDetails.email",
                        avatar: "$studentDetails.avatar"
                    },
                    course: {
                        _id: "$courseDetails._id",
                        title: "$courseDetails.title"
                    },
                    lastMessage: 1,
                    lastMessageTime: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: conversations
        });

    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
};
