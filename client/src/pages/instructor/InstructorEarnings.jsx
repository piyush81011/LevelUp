import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_BASE_URL } from "../../config/api";

const InstructorEarnings = () => {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/enrollments/instructor/earnings`,
                    { withCredentials: true }
                );
                setEarnings(response.data.data);
            } catch (error) {
                console.error("Failed to fetch earnings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
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

    const maxEarning = Math.max(...(earnings?.monthlyEarnings?.map(m => m.earnings) || [1]));

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                    <p className="text-gray-500 mt-1">Track your revenue and payouts</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">${earnings?.totalEarnings?.toFixed(2) || "0.00"}</p>
                        <p className={`text-xs mt-1 ${earnings?.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {earnings?.percentChange >= 0 ? '+' : ''}{earnings?.percentChange || 0}% from last month
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">${earnings?.thisMonthEarnings?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Last Month</p>
                        <p className="text-2xl font-bold text-gray-900">${earnings?.lastMonthEarnings?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-gray-400 mt-1">Previous period</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">{earnings?.totalStudents || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Across all courses</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview (Last 6 Months)</h3>
                    {earnings?.totalEarnings > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                            {earnings?.monthlyEarnings?.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <span className="text-sm font-medium text-gray-900 mb-2">${month.earnings}</span>
                                    <div
                                        className="w-full bg-indigo-500 rounded-t-lg transition-all duration-300 hover:bg-indigo-600"
                                        style={{
                                            height: `${maxEarning > 0 ? (month.earnings / maxEarning) * 180 : 0}px`,
                                            minHeight: month.earnings > 0 ? '20px' : '4px',
                                            backgroundColor: month.earnings === 0 ? '#e5e7eb' : undefined
                                        }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                                    <span className="text-xs text-gray-400">{month.enrollments} sales</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p className="text-gray-500">No earnings data yet</p>
                                <p className="text-sm text-gray-400">Your earnings chart will appear here</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    </div>

                    {earnings?.recentTransactions?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {earnings.recentTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                        <span className="text-green-600 font-medium">
                                                            {transaction.studentName?.charAt(0) || "?"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{transaction.studentName}</p>
                                                        <p className="text-sm text-gray-500">{transaction.studentEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-gray-900">{transaction.courseName}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-green-600 font-semibold">+${transaction.amount?.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                            <p className="text-gray-500">Your transaction history will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorEarnings;
