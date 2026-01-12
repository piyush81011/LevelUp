import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/users",
                    { withCredentials: true }
                );
                setUsers(response.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        if (filter === "all") return true;
        return user.role === filter;
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
                        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                        <p className="text-gray-500 mt-1">View and manage all platform users</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Students</p>
                        <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === "student").length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Instructors</p>
                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === "instructor").length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-500">Admins</p>
                        <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === "admin").length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {["all", "student", "instructor", "admin"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f === "all" ? "All Users" : `${f}s`}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium">{user.name?.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                            user.role === "admin" ? "bg-purple-100 text-purple-700" :
                                            user.role === "instructor" ? "bg-green-100 text-green-700" :
                                            "bg-blue-100 text-blue-700"
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
