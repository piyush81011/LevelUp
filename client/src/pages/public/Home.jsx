import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

const Home = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Don't fetch if user is instructor or admin (they will be redirected)
            if (user?.role === "instructor" || user?.role === "admin") {
                setLoading(false);
                return;
            }

            try {
                // Fetch all published courses
                const coursesRes = await axios.get(`${API_BASE_URL}/api/v1/courses`);
                setCourses(coursesRes.data.data);

                // If logged in as student, fetch user's enrollments
                if (user && user.role === "student") {
                    const enrollmentsRes = await axios.get(
                        `${API_BASE_URL}/api/v1/enrollments/my-enrollments`,
                        { withCredentials: true }
                    );
                    setEnrollments(enrollmentsRes.data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Get enrolled course IDs for quick lookup
    const enrolledCourseIds = enrollments.map(e => e.course?._id);

    // Redirect instructors and admins to their dashboards
    // Must come AFTER all hooks are called
    if (user?.role === "instructor") {
        return <Navigate to="/instructor/dashboard" replace />;
    }
    if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Hero Section - Different for logged in users */}
            {!user ? (
                // Guest Hero
                <div className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                    Master New Skills
                                </span>
                                <br />
                                <span className="text-white">Build Your Future</span>
                            </h1>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 mb-10">
                                Unlock your potential with our expert-led courses. Join a community of learners and start your journey today.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Get Started
                                </Link>
                                <a
                                    href="#courses"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-lg font-bold hover:bg-white/20 transition-all duration-300"
                                >
                                    Browse Courses
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Logged-in User Section
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                        <p className="text-gray-400">Continue your learning journey</p>
                    </div>

                    {/* My Enrolled Courses Section */}
                    {enrollments.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">My Courses</h2>
                                <Link to="/student/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                    View All →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrollments.slice(0, 3).map((enrollment) => (
                                    <div
                                        key={enrollment._id}
                                        className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
                                    >
                                        <div className="h-36 relative overflow-hidden">
                                            {enrollment.course?.thumbnail ? (
                                                <img
                                                    src={enrollment.course.thumbnail}
                                                    alt={enrollment.course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
                                                    <span className="text-4xl font-bold text-white/30">
                                                        {enrollment.course?.title?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                                {enrollment.course?.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mt-1 mb-3 line-clamp-1">
                                                {enrollment.course?.title}
                                            </h3>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">Progress</span>
                                                    <span className="text-white font-medium">
                                                        {enrollment.progress?.completedLessons?.length || 0} lessons
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${Math.min((enrollment.progress?.completedLessons?.length || 0) * 10, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/course/${enrollment.course?._id}/learn`}
                                                className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                Continue Learning
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats for logged in users */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <p className="text-gray-400 text-sm">Enrolled Courses</p>
                            <p className="text-3xl font-bold text-white mt-1">{enrollments.length}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <p className="text-gray-400 text-sm">Lessons Completed</p>
                            <p className="text-3xl font-bold text-green-400 mt-1">
                                {enrollments.reduce((acc, e) => acc + (e.progress?.completedLessons?.length || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <p className="text-gray-400 text-sm">In Progress</p>
                            <p className="text-3xl font-bold text-yellow-400 mt-1">
                                {enrollments.filter(e => !e.progress?.isCompleted && (e.progress?.completedLessons?.length || 0) > 0).length}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <p className="text-gray-400 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-indigo-400 mt-1">
                                {enrollments.filter(e => e.progress?.isCompleted).length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Browse All Courses Section */}
            <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            {user ? "Explore More Courses" : "Featured Courses"}
                        </h2>
                        <p className="text-gray-400 mt-1">Discover new skills to learn</p>
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full hidden sm:block"></div>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700 border-dashed">
                        <h3 className="text-2xl text-gray-400 font-medium">No courses available yet</h3>
                        <p className="text-gray-500 mt-2">Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const isEnrolled = enrolledCourseIds.includes(course._id);
                            return (
                                <div
                                    key={course._id}
                                    className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-52 w-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700 group-hover:bg-gray-600 transition-colors">
                                                <span className="text-6xl font-bold text-gray-500 group-hover:text-gray-400">{course.title.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            {isEnrolled && (
                                                <span className="px-3 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-xs font-semibold text-green-400">
                                                    Enrolled
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                                                {course.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-gray-800">
                                                {course.instructor?.name?.charAt(0) || "I"}
                                            </div>
                                            <span className="ml-3 text-sm text-gray-400">
                                                {course.instructor?.name || "Unknown Instructor"}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                            {course.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                            <div>
                                                <span className="block text-xs text-gray-500">Price</span>
                                                <span className="text-2xl font-bold text-white">
                                                    {course.price === 0 ? "Free" : `$${course.price}`}
                                                </span>
                                            </div>
                                            {isEnrolled ? (
                                                <Link
                                                    to={`/course/${course._id}/learn`}
                                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                                                >
                                                    Continue
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/course/${course._id}`}
                                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
