import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ChatWindow from "../../components/ChatWindow";
import { IoMdChatbubbles } from "react-icons/io";
import { API_BASE_URL } from "../../config/api";

const InstructorMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/chat/conversations`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setConversations(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Sidebar: Conversations List */}
                <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
                    <div className="p-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <IoMdChatbubbles className="text-purple-600" />
                            Messages
                        </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                No messages yet.
                            </div>
                        ) : (
                            <div>
                                {conversations.map((conv, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors ${selectedConversation?.student._id === conv.student._id && selectedConversation?.course._id === conv.course._id
                                            ? "bg-purple-50 border-purple-100"
                                            : ""
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                {conv.student.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate pr-2">
                                                        {conv.student.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-400 shrink-0">
                                                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-indigo-600 font-medium truncate mb-1">
                                                    {conv.course.title}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conv.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Area: Chat Window */}
                <div className={`flex-1 bg-gray-50 flex flex-col items-center justify-center ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
                    {selectedConversation ? (
                        <div className="w-full h-full relative">
                            {/* Mobile header to go back */}
                            <div className="md:hidden bg-white p-3 border-b flex items-center gap-2">
                                <button onClick={() => setSelectedConversation(null)} className="text-gray-600">
                                    &larr; Back
                                </button>
                                <span className="font-bold">{selectedConversation.student.name}</span>
                            </div>

                            {/* Reuse ChatWindow but make it full container instead of floating fixed */}
                            {/* Need to refactor ChatWindow slightly or just override classes via wrapper? 
                                 ChatWindow is position:fixed. We need it relative here.
                                 Quick fix: Wrap inside a div that forces relative behavior or Update ChatWindow to support 'mode' prop (floating vs embedded).
                                 For now, let's just render it. The current ChatWindow is FIXED. 
                                 I should probably update ChatWindow to accept a `className` or `style` prop to override fixed positioning.
                             */}
                            <div className="absolute inset-0 pb-20 md:pb-0">
                                {/* 
                                    Currently ChatWindow is hardcoded fixed. 
                                    I will edit ChatWindow.jsx next to support embedded mode.
                                */}
                                <ChatWindow
                                    courseId={selectedConversation.course._id}
                                    receiverId={selectedConversation.student._id}
                                    onClose={() => setSelectedConversation(null)}
                                    // Pass a prop to signal embedded mode
                                    isEmbedded={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <IoMdChatbubbles size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorMessages;
