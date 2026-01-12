import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("general");

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage platform settings and configuration</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {["general", "security", "email", "appearance"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors capitalize ${
                                        activeTab === tab
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === "general" && (
                            <div className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                                        <input
                                            type="text"
                                            defaultValue="LevelUp"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                        <input
                                            type="email"
                                            defaultValue="support@levelup.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Description</label>
                                        <textarea
                                            rows={3}
                                            defaultValue="An online learning platform for everyone."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Email Verification</p>
                                            <p className="text-sm text-gray-500">Require email verification for new users</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Session Timeout</p>
                                            <p className="text-sm text-gray-500">Auto-logout inactive users</p>
                                        </div>
                                        <select className="px-3 py-2 border border-gray-300 rounded-lg">
                                            <option>30 minutes</option>
                                            <option>1 hour</option>
                                            <option>24 hours</option>
                                            <option>Never</option>
                                        </select>
                                    </label>
                                </div>

                                <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === "email" && (
                            <div className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                                        <input
                                            type="text"
                                            placeholder="smtp.example.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                                        <input
                                            type="text"
                                            placeholder="587"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === "appearance" && (
                            <div className="max-w-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                        <div className="flex gap-2">
                                            {["#4F46E5", "#7C3AED", "#2563EB", "#059669", "#DC2626"].map((color) => (
                                                <button
                                                    key={color}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-gray-500">Click to upload logo</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
