import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { IoMdChatbubbles } from "react-icons/io";
import ChatWindow from "../../components/ChatWindow";
import InstructorChatList from "../../components/InstructorChatList";
import { API_BASE_URL } from "../../config/api";

const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChatCourse, setActiveChatCourse] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/courses/my-courses`,
                    { withCredentials: true }
                );
                setCourses(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                        <p className="text-gray-500 mt-1">Manage your created courses</p>
                    </div>
                    <Link
                        to="/instructor/create-course"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Course
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-4">Create your first course to start teaching!</p>
                        <Link
                            to="/instructor/create-course"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Create Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white/50">{course.title?.charAt(0)}</span>
                                        </div>
                                    )}
                                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${course.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
                                        }`}>
                                        {course.isPublished ? "Published" : "Draft"}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                        {course.category || "Uncategorized"}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{course.sections?.length || 0} sections</p>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/instructor/course/${course._id}/edit`}
                                            className="flex-1 text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => setActiveChatCourse(activeChatCourse === course._id ? null : course._id)}
                                            className="flex-1 text-center py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            <IoMdChatbubbles />
                                            Chat
                                        </button>
                                        <Link
                                            to={`/instructor/course/${course._id}/manage`}
                                            className="flex-1 text-center py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {activeChatCourse && !selectedStudent && (
                <InstructorChatList
                    courseId={activeChatCourse}
                    onSelectStudent={(student) => setSelectedStudent(student)}
                    onClose={() => setActiveChatCourse(null)}
                />
            )}

            {activeChatCourse && selectedStudent && (
                <ChatWindow
                    courseId={activeChatCourse}
                    receiverId={selectedStudent._id}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </DashboardLayout>
    );
};

export default InstructorCourses;
