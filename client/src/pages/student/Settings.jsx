import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                "http://localhost:8000/api/v1/users/update-profile",
                { name: formData.name },
                { withCredentials: true }
            );
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await axios.put(
                "http://localhost:8000/api/v1/users/change-password",
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                },
                { withCredentials: true }
            );
            toast.success("Password changed successfully!");
            setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", name: "Profile", icon: "user" },
        { id: "security", name: "Security", icon: "lock" },
        { id: "notifications", name: "Notifications", icon: "bell" },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "profile" && (
                            <form onSubmit={handleProfileUpdate} className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 capitalize"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        )}

                        {activeTab === "security" && (
                            <form onSubmit={handlePasswordChange} className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Changing..." : "Change Password"}
                                </button>
                            </form>
                        )}

                        {activeTab === "notifications" && (
                            <div className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive email updates about your courses</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Course Updates</p>
                                            <p className="text-sm text-gray-500">Get notified when enrolled courses are updated</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Marketing Emails</p>
                                            <p className="text-sm text-gray-500">Receive promotional offers and news</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                                    </label>
                                </div>

                                <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    Save Preferences
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
