import { Server } from "socket.io";
import { Message } from "./models/message.model.js";

const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_chat", (courseId) => {
            socket.join(courseId);
            console.log(`User ${socket.id} joined course: ${courseId}`);
        });

        socket.on("send_message", async (data) => {
            // data: { sender, receiver, course, content, roomId }
            try {
                const { roomId, ...messageData } = data;
                const newMessage = new Message(messageData);
                await newMessage.save();

                // Broadcast to specific room (roomId or defaults to course)
                const targetRoom = roomId || data.course;
                io.to(targetRoom).emit("receive_message", newMessage);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export { initializeSocket };
