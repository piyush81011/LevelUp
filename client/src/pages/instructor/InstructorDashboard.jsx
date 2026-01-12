import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [publishing, setPublishing] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/courses/my-courses",
                { withCredentials: true }
            );
            setCourses(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        
        setDeleting(courseId);
        try {
            await axios.delete(
                `http://localhost:8000/api/v1/courses/${courseId}`,
                { withCredentials: true }
            );
            toast.success("Course deleted successfully");
            setCourses(courses.filter(course => course._id !== courseId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete course");
        } finally {
            setDeleting(null);
        }
    };

    const handleTogglePublish = async (courseId, currentStatus) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
        setPublishing(courseId);
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/courses/${courseId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            toast.success(`Course ${newStatus === "published" ? "published" : "unpublished"} successfully`);
            setCourses(courses.map(course => 
                course._id === courseId ? { ...course, status: newStatus } : course
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update course");
        } finally {
            setPublishing(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 lg:p-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your courses and track performance</p>
                    </div>
                    <Link
                        to="/instructor/create-course"
                        className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Course
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Total Courses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Published</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                            {courses.filter(c => c.status === "published").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Drafts</p>
                        <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">
                            {courses.filter(c => c.status === "draft").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">$0</p>
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first course</p>
                        <Link 
                            to="/instructor/create-course" 
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Create your first course
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div 
                                key={course._id} 
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                            >
                                {/* Course Thumbnail */}
                                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                    {course.thumbnail ? (
                                        <img 
                                            src={course.thumbnail} 
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                        course.status === "published" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {course.status === "published" ? "Published" : "Draft"}
                                    </span>
                                </div>
                                
                                {/* Course Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span className="inline-flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {course.category}
                                        </span>
                                        <span className="font-semibold text-indigo-600">${course.price}</span>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleTogglePublish(course._id, course.status)}
                                            disabled={publishing === course._id}
                                            className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                                course.status === "published"
                                                    ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                                                    : "text-green-600 bg-green-50 hover:bg-green-100"
                                            }`}
                                        >
                                            {publishing === course._id 
                                                ? "Updating..." 
                                                : course.status === "published" 
                                                    ? "Unpublish" 
                                                    : "Publish"}
                                        </button>
                                        <Link 
                                            to={`/instructor/course/${course._id}/edit`} 
                                            className="flex-1 text-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(course._id)}
                                            disabled={deleting === course._id}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            {deleting === course._id ? "..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InstructorDashboard;
