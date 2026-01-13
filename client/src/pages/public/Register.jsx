import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/users/register`,
                formData,
                { withCredentials: true }
            );
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join our community and start learning
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-900/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-900/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-900/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="sr-only">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-600 bg-gray-900/50 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                            >
                                <option value="student" className="bg-gray-800">Student</option>
                                <option value="instructor" className="bg-gray-800">Instructor</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Instructors can create courses.</p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
