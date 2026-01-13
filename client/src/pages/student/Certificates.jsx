import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_BASE_URL } from "../../config/api";

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                // Get all enrollments and filter for completed ones
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/enrollments/my-enrollments`,
                    { withCredentials: true }
                );
                const enrollments = response.data.data || [];

                // Fetch progress for each to check completion
                const completedCourses = [];
                for (const enrollment of enrollments) {
                    try {
                        const progressRes = await axios.get(
                            `${API_BASE_URL}/api/v1/enrollments/${enrollment.course?._id}/progress`,
                            { withCredentials: true }
                        );
                        if (progressRes.data.data.isCompleted) {
                            // Get certificate data
                            const certRes = await axios.get(
                                `${API_BASE_URL}/api/v1/enrollments/${enrollment.course?._id}/certificate`,
                                { withCredentials: true }
                            );
                            completedCourses.push({
                                ...certRes.data.data,
                                courseId: enrollment.course?._id,
                            });
                        }
                    } catch {
                        // Course not completed or error
                    }
                }
                setCertificates(completedCourses);
            } catch (error) {
                console.error("Failed to fetch certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
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
                    <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
                    <p className="text-gray-500 mt-1">View and download your earned certificates</p>
                </div>

                {certificates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                        <p className="text-gray-500 mb-4">Complete a course to earn your first certificate!</p>
                        <Link to="/student/courses" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            View my courses →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {certificates.map((cert, index) => (
                            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="h-32 bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                        {cert.courseName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Instructor: {cert.instructorName}
                                    </p>
                                    <div className="text-xs text-gray-400 mb-4">
                                        <p>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                                        <p className="font-mono">ID: {cert.certificateId}</p>
                                    </div>
                                    <Link
                                        to={`/course/${cert.courseId}/certificate`}
                                        className="block w-full text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        View Certificate
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Certificates;
