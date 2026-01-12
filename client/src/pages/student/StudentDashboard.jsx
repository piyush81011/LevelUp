import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";

const StudentDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState({});

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/enrollments/my-enrollments",
                    { withCredentials: true }
                );
                const enrollmentData = response.data.data;
                setEnrollments(enrollmentData);
                
                // Fetch progress for each enrollment
                const progressPromises = enrollmentData.map(async (enrollment) => {
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
                toast.error("Failed to fetch enrollments");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    // Calculate stats
    const completedCourses = Object.values(progressData).filter(p => p.isCompleted).length;
    const inProgressCourses = enrollments.length - completedCourses;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            My Learning Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">Track your progress and continue learning</p>
                    </div>
                    <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Courses
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Enrolled Courses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</p>
                        <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{inProgressCourses}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{completedCourses}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Certificates</p>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">{completedCourses}</p>
                    </div>
                </div>

                {enrollments.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6">You haven't enrolled in any courses yet.</p>
                        <Link to="/" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => {
                            const courseProgress = progressData[enrollment.course?._id] || {};
                            const progress = courseProgress.progressPercentage || 0;
                            const isCompleted = courseProgress.isCompleted || false;
                            
                            return (
                            <div key={enrollment._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                                    {enrollment.course?.thumbnail ? (
                                        <img
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white/50">{enrollment.course?.title?.charAt(0)}</span>
                                        </div>
                                    )}
                                    {isCompleted && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Completed
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                            {enrollment.course?.category || "Course"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {enrollment.course?.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        By {enrollment.course?.instructor?.name || "Unknown"}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-gray-900 font-medium">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {isCompleted ? (
                                        <Link
                                            to={`/course/${enrollment.course?._id}/certificate`}
                                            className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-gray-900 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            🎓 View Certificate
                                        </Link>
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
                        )})}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
