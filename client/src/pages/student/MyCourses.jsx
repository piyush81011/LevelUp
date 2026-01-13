import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState({});
    const [filter, setFilter] = useState("all"); // all, in-progress, completed

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/enrollments/my-enrollments",
                    { withCredentials: true }
                );
                const enrollmentsData = response.data.data || [];
                setEnrollments(enrollmentsData);

                // Fetch progress for each enrollment
                const progressPromises = enrollmentsData.map(async (enrollment) => {
                    try {
                        const progressRes = await axios.get(
                            `http://localhost:8000/api/v1/enrollments/${enrollment.course?._id}/progress`,
                            { withCredentials: true }
                        );
                        return { courseId: enrollment.course?._id, progress: progressRes.data.data };
                    } catch {
                        return { courseId: enrollment.course?._id, progress: { progressPercentage: 0, isCompleted: false } };
                    }
                });

                const progressResults = await Promise.all(progressPromises);
                const progressMap = {};
                progressResults.forEach(({ courseId, progress }) => {
                    progressMap[courseId] = progress;
                });
                setProgressData(progressMap);
            } catch (error) {
                console.error("Failed to fetch enrollments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter((enrollment) => {
        const progress = progressData[enrollment.course?._id] || {};
        if (filter === "completed") return progress.isCompleted;
        if (filter === "in-progress") return !progress.isCompleted && progress.progressPercentage > 0;
        return true;
    });

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
                        <p className="text-gray-500 mt-1">Manage and continue your learning journey</p>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Browse More Courses
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {["all", "in-progress", "completed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === f
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f === "all" ? "All Courses" : f === "in-progress" ? "In Progress" : "Completed"}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                {filteredEnrollments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 mb-4">
                            {filter === "all" ? "You haven't enrolled in any courses yet." : `No ${filter} courses.`}
                        </p>
                        <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Browse courses →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEnrollments.map((enrollment) => {
                            const courseProgress = progressData[enrollment.course?._id] || {};
                            const progress = courseProgress.progressPercentage || 0;
                            const isCompleted = courseProgress.isCompleted || false;

                            return (
                                <div key={enrollment._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                        {enrollment.course?.thumbnail ? (
                                            <img
                                                src={enrollment.course.thumbnail}
                                                alt={enrollment.course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl font-bold text-white/50">{enrollment.course?.title?.charAt(0)}</span>
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                ✓ Completed
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                            {enrollment.course?.category || "Course"}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 line-clamp-1">
                                            {enrollment.course?.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            By {enrollment.course?.instructor?.name || "Unknown"}
                                        </p>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="text-gray-900 font-medium">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-indigo-500"}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {isCompleted ? (
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/course/${enrollment.course?._id}/learn`}
                                                    className="flex-1 text-center py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    ▶ Watch Again
                                                </Link>
                                                <Link
                                                    to={`/course/${enrollment.course?._id}/certificate`}
                                                    className="flex-1 text-center py-2.5 px-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    🎓 Certificate
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link
                                                to={`/course/${enrollment.course?._id}/learn`}
                                                className="block w-full text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                Continue Learning
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCourses;
