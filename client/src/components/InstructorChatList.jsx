import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdClose, IoMdChatbubbles } from "react-icons/io";

const InstructorChatList = ({ courseId, onSelectStudent, onClose }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/chat/users/${courseId}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setStudents(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch chat users");
            } finally {
                setLoading(false);
            }
        };

        fetchChatUsers();
    }, [courseId]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <IoMdChatbubbles />
                        Student Messages
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
                        <IoMdClose size={24} />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No messages from students yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {students.map((student) => (
                                <button
                                    key={student._id}
                                    onClick={() => onSelectStudent(student)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-200"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        {student.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorChatList;
