import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/courses",
                    { withCredentials: true }
                );
                setCourses(response.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) => {
        if (filter === "all") return true;
        if (filter === "published") return course.isPublished;
        if (filter === "draft") return !course.isPublished;
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
                        <p className="text-gray-500 mt-1">View and manage all platform courses</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Published</p>
                        <p className="text-2xl font-bold text-green-600">{courses.filter(c => c.isPublished).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Drafts</p>
                        <p className="text-2xl font-bold text-yellow-600">{courses.filter(c => !c.isPublished).length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {["all", "published", "draft"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f === "all" ? "All Courses" : f}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="h-36 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white/50">{course.title?.charAt(0)}</span>
                                    </div>
                                )}
                                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                                    course.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
                                }`}>
                                    {course.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <div className="p-4">
                                <span className="text-xs font-semibold text-indigo-600 uppercase">{course.category}</span>
                                <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">{course.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">By {course.instructor?.name || "Unknown"}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-gray-400">{course.sections?.length || 0} sections</span>
                                    <Link
                                        to={`/course/${course._id}`}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCourses;
