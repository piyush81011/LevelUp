import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    // Define navigation items based on user role
    const getNavItems = () => {
        const role = user?.role;

        if (role === "admin") {
            return [
                { name: "Dashboard", path: "/admin/dashboard", icon: "home" },
                { name: "Manage Users", path: "/admin/users", icon: "users" },
                { name: "Manage Courses", path: "/admin/courses", icon: "book" },
                { name: "Enrollments", path: "/admin/enrollments", icon: "clipboard" },
                { name: "Analytics", path: "/admin/analytics", icon: "chart" },
                { name: "Settings", path: "/admin/settings", icon: "settings" },
            ];
        }

        if (role === "instructor") {
            return [
                { name: "Dashboard", path: "/instructor/dashboard", icon: "home" },
                { name: "My Courses", path: "/instructor/courses", icon: "book" },
                { name: "Create Course", path: "/instructor/create-course", icon: "plus" },
                { name: "Students", path: "/instructor/students", icon: "users" },
                { name: "Earnings", path: "/instructor/earnings", icon: "dollar" },
                { name: "Settings", path: "/instructor/settings", icon: "settings" },
            ];
        }

        // Student (default)
        return [
            { name: "Dashboard", path: "/student/dashboard", icon: "home" },
            { name: "My Courses", path: "/student/courses", icon: "book" },
            { name: "Browse Courses", path: "/", icon: "search" },
            { name: "Certificates", path: "/student/certificates", icon: "award" },
            { name: "Settings", path: "/student/settings", icon: "settings" },
        ];
    };

    const navItems = getNavItems();

    const getIcon = (iconName) => {
        const icons = {
            home: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            book: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            users: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            plus: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            search: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            award: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            settings: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            chart: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            clipboard: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            dollar: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
        return icons[iconName] || icons.home;
    };

    const isActive = (path) => location.pathname === path;

    const getRoleLabel = () => {
        const role = user?.role;
        if (role === "admin") return "Administrator";
        if (role === "instructor") return "Instructor";
        return "Student";
    };

    const getRoleColor = () => {
        const role = user?.role;
        if (role === "admin") return "bg-red-100 text-red-800";
        if (role === "instructor") return "bg-purple-100 text-purple-800";
        return "bg-indigo-100 text-indigo-800";
    };

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            >
                {sidebarOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
                    transform transition-transform duration-300 ease-in-out
                    lg:transform-none lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    mt-16 lg:mt-0
                `}
            >
                <div className="flex flex-col h-full">
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || "User"}
                                </p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor()}`}>
                                    {getRoleLabel()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive(item.path)
                                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 -ml-1 pl-4"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }
                                `}
                            >
                                <span className={`mr-3 ${isActive(item.path) ? "text-indigo-600" : "text-gray-400"}`}>
                                    {getIcon(item.icon)}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
                            <h4 className="font-semibold text-sm mb-1">Need Help?</h4>
                            <p className="text-xs text-indigo-100 mb-3">Check our documentation or contact support.</p>
                            <Link
                                to="/help"
                                className="inline-flex items-center text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors"
                            >
                                Get Support
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
