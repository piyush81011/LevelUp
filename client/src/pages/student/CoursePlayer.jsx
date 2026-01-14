import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdChatbubbles } from "react-icons/io";
import ChatWindow from "../../components/ChatWindow";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [marking, setMarking] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completingCourse, setCompletingCourse] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                // Fetch full course details (populated with sections and lessons)
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/courses/${courseId}`,
                    { withCredentials: true }
                );
                const courseData = response.data.data;
                setCourse(courseData);

                // Auto-select first lesson
                if (courseData.sections?.length > 0 && courseData.sections[0].lessons?.length > 0) {
                    setCurrentLesson(courseData.sections[0].lessons[0]);
                }

                // Fetch progress
                const progressRes = await axios.get(
                    `${API_BASE_URL}/api/v1/enrollments/${courseId}/progress`,
                    { withCredentials: true }
                );
                setCompletedLessons(progressRes.data.data.completedLessons || []);
                setIsCompleted(progressRes.data.data.isCompleted || false);
            } catch (error) {
                toast.error("Failed to load course content");
                // navigate("/student/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseContent();
    }, [courseId]);

    const handleLessonSelect = (lesson) => {
        setCurrentLesson(lesson);
    };

    const handleMarkComplete = async () => {
        if (!currentLesson || completedLessons.includes(currentLesson._id)) return;

        setMarking(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/enrollments/${courseId}/lesson/${currentLesson._id}/complete`,
                {},
                { withCredentials: true }
            );
            setCompletedLessons([...completedLessons, currentLesson._id]);
            toast.success("Lesson marked as complete!");
        } catch (error) {
            toast.error("Failed to mark lesson complete");
        } finally {
            setMarking(false);
        }
    };

    const handleCompleteCourse = async () => {
        setCompletingCourse(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/enrollments/${courseId}/complete`,
                {},
                { withCredentials: true }
            );
            setIsCompleted(true);
            toast.success("🎉 Congratulations! Course completed! Your certificate is ready.");
            navigate(`/course/${courseId}/certificate`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to complete course");
        } finally {
            setCompletingCourse(false);
        }
    };

    // Calculate progress percentage
    const totalLessons = course?.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    // Helper to extract YouTube ID and format embed URL
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return "";

        let videoId = "";

        // Handle various YouTube formats
        if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v");
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        } else if (url.includes("youtube.com/embed/")) {
            videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
        } else if (url.includes("m.youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v");
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return url; // Return original if parsing fails (might be direct video file)
    };

    // Auto-close sidebar on mobile on initial load
    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!course) return <div className="text-white text-center mt-20">Course content not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden relative">
            {/* Top Bar */}
            <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/student/dashboard")}
                        className="text-gray-400 hover:text-white"
                    >
                        &larr; Back
                    </button>
                    <h1 className="text-lg font-bold truncate max-w-md">{course.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-400">{progressPercentage}%</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden text-gray-400 p-2 hover:bg-gray-700 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Main Content (Player) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
                    {currentLesson ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8 relative">
                                {/* Flexible Video Player logic */}
                                {currentLesson.videoUrl.includes("youtu") ? (
                                    <iframe
                                        src={getYoutubeEmbedUrl(currentLesson.videoUrl)}
                                        title={currentLesson.title}
                                        className="w-full h-full absolute inset-0"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video
                                        src={currentLesson.videoUrl}
                                        controls
                                        className="w-full h-full object-contain absolute inset-0"
                                    />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={marking || completedLessons.includes(currentLesson._id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${completedLessons.includes(currentLesson._id)
                                            ? "bg-green-600/20 text-green-400 cursor-default"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                            }`}
                                    >
                                        {completedLessons.includes(currentLesson._id) ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Completed
                                            </>
                                        ) : marking ? (
                                            "Marking..."
                                        ) : (
                                            "Mark as Complete"
                                        )}
                                    </button>
                                </div>
                                {currentLesson.content && (
                                    <div className="prose prose-invert max-w-none bg-gray-800 p-6 rounded-xl">
                                        <p>{currentLesson.content}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xl">Select a lesson to start watching</p>
                        </div>
                    )}
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar (Curriculum) */}
                <div
                    className={`
                        fixed md:static top-[64px] right-0 bottom-0 z-40
                        w-80 bg-gray-800 border-l border-gray-700 
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                        flex flex-col shrink-0 h-[calc(100vh-64px)] md:h-full
                    `}
                >
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                            Course Content
                        </span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Certificate / Complete Course Section */}
                    <div className="p-4 border-b border-gray-700">
                        {isCompleted ? (
                            <Link
                                to={`/course/${courseId}/certificate`}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 rounded-lg font-semibold hover:from-yellow-400 hover:to-amber-400 transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                View Certificate
                            </Link>
                        ) : progressPercentage === 100 ? (
                            <button
                                onClick={handleCompleteCourse}
                                disabled={completingCourse}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all disabled:opacity-50"
                            >
                                {completingCourse ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Certificate...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Complete & Get Certificate
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-400 mb-2">
                                    Complete all lessons to earn your certificate
                                </p>
                                <p className="text-xs text-gray-500">
                                    {completedLessons.length} of {totalLessons} lessons completed
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {course.sections?.map((section, index) => (
                            <div key={section._id} className="border-b border-gray-700/50">
                                <div className="px-4 py-3 bg-gray-800/50 font-semibold text-gray-300 text-sm">
                                    Section {index + 1}: {section.title}
                                </div>
                                <div>
                                    {section.lessons?.map((lesson, lIndex) => (
                                        <button
                                            key={lesson._id}
                                            onClick={() => handleLessonSelect(lesson)}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-700 transition-colors ${currentLesson?._id === lesson._id ? "bg-indigo-600/20 text-indigo-400 border-r-2 border-indigo-500" : "text-gray-400"
                                                }`}
                                        >
                                            {completedLessons.includes(lesson._id) ? (
                                                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                <span className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0 flex items-center justify-center text-xs">
                                                    {lIndex + 1}
                                                </span>
                                            )}
                                            <span className="line-clamp-2">{lesson.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {user && (
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
        </div>
    );
};

export default CoursePlayer;
