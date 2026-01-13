import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { IoMdSend, IoMdClose } from "react-icons/io";
import { API_BASE_URL, SOCKET_URL } from "../config/api";

const ChatWindow = ({ courseId, onClose, receiverId, isEmbedded = false }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Determine Room ID
        // For student: courseId_studentId
        // For instructor: courseId_studentId
        // We need the "other" user ID to form the room correctly consistently.
        // Structure: "courseId_studentId" is reliable.

        let activeRoomId = "";

        if (receiverId) {
            if (user.role === "student") {
                activeRoomId = `${courseId}_${user._id}`;
            } else {
                activeRoomId = `${courseId}_${receiverId}`;
            }
        } else {
            // Fallback for students who might not have receiverId passed yet?
            if (user.role === "student") {
                activeRoomId = `${courseId}_${user._id}`;
            }
        }

        const fetchHistory = async () => {
            try {
                let url = `${API_BASE_URL}/api/v1/chat/${courseId}`;
                if (user.role === "instructor" && receiverId) {
                    url += `?studentId=${receiverId}`;
                }

                const response = await axios.get(url, { withCredentials: true });
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch chat history");
            }
        };

        if (activeRoomId) {
            fetchHistory();

            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.emit("join_chat", activeRoomId); // Join private room

            newSocket.on("receive_message", (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => newSocket.close();
        }
    }, [courseId, receiverId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim() && socket) {
            let activeRoomId = "";
            if (user.role === "student") {
                activeRoomId = `${courseId}_${user._id}`;
            } else {
                activeRoomId = `${courseId}_${receiverId}`;
            }

            const messageData = {
                sender: user._id,
                receiver: receiverId || null,
                course: courseId,
                content: newMessage,
                roomId: activeRoomId
            };
            socket.emit("send_message", messageData);
            setNewMessage("");
        }
    };

    const positionClasses = isEmbedded
        ? "w-full h-full bg-gray-900 flex flex-col"
        : "fixed bottom-4 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col z-50";

    return (
        <div className={positionClasses}>
            <div className={`bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700 ${!isEmbedded && "rounded-t-lg"}`}>
                <h3 className="text-white font-semibold">Course Chat</h3>
                {!isEmbedded && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <IoMdClose size={20} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => {
                    const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                    const isMyMessage = senderId === user._id;

                    return (
                        <div
                            key={index}
                            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] p-2 rounded-lg text-sm ${isMyMessage
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-700 text-gray-200"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className={`p-3 bg-gray-800 border-t border-gray-700 flex gap-2 ${!isEmbedded && "rounded-b-lg"}`}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white border-0 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                />
                <button
                    onClick={handleSend}
                    className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
                >
                    <IoMdSend size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
