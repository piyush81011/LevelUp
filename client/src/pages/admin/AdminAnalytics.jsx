import DashboardLayout from "../../components/layout/DashboardLayout";

const AdminAnalytics = () => {
    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-1">Platform performance and insights</p>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$0.00</p>
                        <p className="text-xs text-green-600 mt-1">+0% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">New Users</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-400 mt-1">This month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Course Completions</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-400 mt-1">This month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                                <p className="text-sm text-gray-500">Chart coming soon</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Chart coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Courses */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h3>
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-sm text-gray-500">Course analytics coming soon</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAnalytics;
