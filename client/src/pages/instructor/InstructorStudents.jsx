import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_BASE_URL } from "../../config/api";

const InstructorStudents = () => {
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/enrollments/instructor/students`,
                    { withCredentials: true }
                );
                setStudents(response.data.data.students || []);
                setStats(response.data.data.stats || { total: 0, completed: 0, inProgress: 0 });
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                    <p className="text-gray-500 mt-1">View students enrolled in your courses</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                                <p className="text-sm text-gray-500">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                                <p className="text-sm text-gray-500">In Progress</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
                    </div>

                    {students.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
                            <p className="text-gray-500">Students will appear here once they enroll in your courses.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((enrollment) => (
                                        <tr key={enrollment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-indigo-600 font-medium">
                                                            {enrollment.student?.name?.charAt(0) || "?"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{enrollment.student?.name}</p>
                                                        <p className="text-sm text-gray-500">{enrollment.student?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-gray-900 font-medium">{enrollment.course?.title}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-full rounded-full ${enrollment.isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                            style={{ width: `${enrollment.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {enrollment.completedLessons} / {enrollment.totalLessons} lessons
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.isCompleted
                                                        ? 'bg-green-100 text-green-700'
                                                        : enrollment.progress > 0
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {enrollment.isCompleted ? 'Completed' : enrollment.progress > 0 ? 'In Progress' : 'Not Started'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorStudents;
