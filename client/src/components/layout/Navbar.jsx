import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">LevelUp</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/#courses" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                            Courses
                        </Link>
                        {user && (
                            <>
                                {user.role === "instructor" && (
                                    <Link to="/instructor/dashboard" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                        Dashboard
                                    </Link>
                                )}
                                {user.role === "student" && (
                                    <Link to="/student/dashboard" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                        My Learning
                                    </Link>
                                )}
                                {user.role === "admin" && (
                                    <Link to="/admin/dashboard" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-300 text-sm">
                                        <span className="text-white font-medium">{user.name}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/10 hover:border-red-500/30"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 text-sm font-medium"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col space-y-2">
                            <Link 
                                to="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/#courses" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                            >
                                Courses
                            </Link>
                            {user && (
                                <>
                                    {user.role === "instructor" && (
                                        <Link 
                                            to="/instructor/dashboard" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === "student" && (
                                        <Link 
                                            to="/student/dashboard" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                                        >
                                            My Learning
                                        </Link>
                                    )}
                                    {user.role === "admin" && (
                                        <Link 
                                            to="/admin/dashboard" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                </>
                            )}
                            
                            <div className="pt-4 mt-2 border-t border-white/10">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 px-4 py-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2 px-4">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center text-white bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
