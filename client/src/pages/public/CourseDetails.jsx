import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { IoMdChatbubbles } from "react-icons/io";
import ChatWindow from "../../components/ChatWindow";
import { API_BASE_URL } from "../../config/api";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/courses/${courseId}`);
                setCourse(response.data.data);
            } catch (error) {
                toast.error("Failed to fetch course details");
            } finally {
                setLoading(false);
            }
        };

        const checkEnrollment = async () => {
            if (!user) return;
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/enrollments/${courseId}/status`,
                    { withCredentials: true }
                );
                setIsEnrolled(response.data.data.isEnrolled);
            } catch (error) {
                console.error("Failed to check enrollment status");
            }
        };

        fetchCourse();
        checkEnrollment();
    }, [courseId, user]);

    const handleEnroll = async () => {
        if (!user) {
            toast.info("Please login to enroll in this course");
            navigate("/login");
            return;
        }

        setEnrolling(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/enrollments/${courseId}`,
                {},
                { withCredentials: true }
            );
            toast.success("Successfully enrolled in the course!");
            setIsEnrolled(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to enroll");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-bold mb-4">Course Not Found</h2>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Hero Section */}
            <div className="relative py-20 bg-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-900/20 transform skew-x-12"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6 border border-indigo-500/30">
                            {course.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                                    {course.instructor?.name?.charAt(0) || "I"}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Instructor</p>
                                    <p className="font-semibold">{course.instructor?.name || "Unknown Instructor"}</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-gray-700 mx-2"></div>
                            <div>
                                <p className="text-sm text-gray-400">Last Updated</p>
                                <p className="font-semibold">{new Date(course.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isEnrolled ? (
                                <Link
                                    to={`/course/${courseId}/learn`}
                                    className="px-8 py-4 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600 transition-all duration-300 shadow-xl shadow-green-500/20 transform hover:-translate-y-1"
                                >
                                    Continue Learning
                                </Link>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-white/10 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enrolling ? "Enrolling..." : `Enroll Now for ${course.price === 0 ? "Free" : `$${course.price}`}`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Check if thumbnail exists */}
                    {course.thumbnail && (
                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Content Placeholder */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* What you'll learn */}
                        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold mb-6">What you'll learn</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3">
                                    <svg className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">Master core concepts and fundamentals</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">Build real-world projects from scratch</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">Learn industry best practices</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">Get hands-on experience with exercises</span>
                                </li>
                            </ul>
                        </div>

                        {/* Curriculum - Real Sections & Lessons */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Course Content</h3>
                            <div className="mb-4 text-sm text-gray-400">
                                {course.sections?.length || 0} sections • {course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0} lessons
                            </div>
                            <div className="space-y-4">
                                {course.sections && course.sections.length > 0 ? (
                                    course.sections.map((section, index) => (
                                        <div key={section._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                                            <div className="px-6 py-4 flex justify-between items-center bg-gray-800/80">
                                                <span className="font-semibold">
                                                    Section {index + 1}: {section.title}
                                                </span>
                                                <span className="text-gray-400 text-sm">
                                                    {section.lessons?.length || 0} {section.lessons?.length === 1 ? "Lesson" : "Lessons"}
                                                </span>
                                            </div>
                                            {section.lessons && section.lessons.length > 0 && (
                                                <div className="border-t border-gray-700">
                                                    {section.lessons.map((lesson, lessonIndex) => (
                                                        <div
                                                            key={lesson._id}
                                                            className="px-6 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 last:border-b-0"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                                                                    {lessonIndex + 1}
                                                                </span>
                                                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-gray-300 text-sm">{lesson.title}</span>
                                                            </div>
                                                            {lesson.duration && (
                                                                <span className="text-gray-500 text-xs">{lesson.duration}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                                        <p className="text-gray-400">Course content will be available soon.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
                            <h3 className="text-xl font-bold mb-4">This course includes:</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0} video lessons</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>{course.sections?.length || 0} sections</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Access on mobile and TV</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Full lifetime access</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Certificate of completion</span>
                                </li>
                            </ul>

                            {/* Price Card */}
                            <div className="pt-6 border-t border-gray-700">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-white">
                                        {course.price === 0 ? "Free" : `$${course.price}`}
                                    </span>
                                </div>
                                {isEnrolled ? (
                                    <Link
                                        to={`/course/${courseId}/learn`}
                                        className="block w-full text-center py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                                    >
                                        Continue Learning
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        {enrolling ? "Enrolling..." : "Enroll Now"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEnrolled && (
                <>
                    {!showChat && (
                        <button
                            onClick={() => setShowChat(true)}
                            className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition z-50 flex items-center justify-center animate-bounce"
                            title="Chat with Instructor"
                        >
                            <IoMdChatbubbles size={28} />
                        </button>
                    )}
                    {showChat && <ChatWindow courseId={courseId} receiverId={course.instructor?._id} onClose={() => setShowChat(false)} />}
                </>
            )}

            {/* Mobile Sticky Enroll Bar */}
            {!isEnrolled && (
                <div className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-4 z-40 flex items-center justify-between shadow-xl pb-6">
                    <div>
                        <span className="text-gray-400 text-xs text-xs">Price</span>
                        <div className="text-xl font-bold text-white">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                        </div>
                    </div>
                    <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
