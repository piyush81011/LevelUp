import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Support = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        category: "general",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }
        
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Your support request has been submitted! We'll get back to you within 24-48 hours.");
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                subject: "",
                category: "general",
                message: ""
            });
            setLoading(false);
        }, 1000);
    };

    const faqs = [
        {
            question: "How do I enroll in a course?",
            answer: "To enroll in a course, simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. If you're not logged in, you'll be prompted to create an account or sign in first."
        },
        {
            question: "How can I access my enrolled courses?",
            answer: "Once enrolled, you can access your courses from your Student Dashboard. Click on 'My Courses' in the sidebar to see all your enrolled courses and continue learning from where you left off."
        },
        {
            question: "How do I get my certificate after completing a course?",
            answer: "After completing all lessons in a course, your certificate will be automatically generated. You can view and download it from the course page or from the 'Certificates' section in your dashboard."
        },
        {
            question: "Can I watch courses on mobile devices?",
            answer: "Yes! Our platform is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers."
        },
        {
            question: "How do I become an instructor?",
            answer: "To become an instructor, register for an account and select 'Instructor' as your role during signup. Once approved, you can start creating and publishing courses from your Instructor Dashboard."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, debit cards, and various digital payment methods. All transactions are processed securely through our payment partners."
        },
        {
            question: "Can I get a refund for a course?",
            answer: "Yes, we offer a 30-day money-back guarantee for all courses. If you're not satisfied with a course, contact our support team within 30 days of purchase for a full refund."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on 'Login' and then 'Forgot Password'. Enter your email address, and we'll send you a link to reset your password."
        }
    ];

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "Email Us",
            value: "support@levelup.com",
            description: "We'll respond within 24 hours",
            link: "mailto:support@levelup.com"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: "Call Us",
            value: "+1 (555) 123-4567",
            description: "Mon-Fri, 9AM-6PM EST",
            link: "tel:+15551234567"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Visit Us",
            value: "123 Learning Street",
            description: "New York, NY 10001",
            link: "https://www.google.com/maps/search/?api=1&query=123+Learning+Street+New+York+NY+10001"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        How Can We <span className="text-indigo-400">Help You?</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        We're here to help you succeed. Browse our FAQs or reach out to our support team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 text-center">
                            <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
                            {info.link ? (
                                <a
                                    href={info.link}
                                    target={info.title === 'Visit Us' ? '_blank' : undefined}
                                    rel={info.title === 'Visit Us' ? 'noopener noreferrer' : undefined}
                                    className="text-indigo-400 font-medium mb-1 block hover:underline break-all"
                                >
                                    {info.value}
                                </a>
                            ) : (
                                <p className="text-indigo-400 font-medium mb-1">{info.value}</p>
                            )}
                            <p className="text-sm text-gray-400">{info.description}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="billing">Billing & Payments</option>
                                        <option value="course">Course Content</option>
                                        <option value="account">Account Issues</option>
                                        <option value="feedback">Feedback & Suggestions</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Subject <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Message <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Please describe your issue or question in detail..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors"
                                    >
                                        <span className="font-medium text-white pr-4">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-5 pb-4">
                                            <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Help Section */}
                <div className="mt-16 bg-gradient-to-r from-gray-800 via-indigo-800 to-gray-900 rounded-2xl p-8 text-center border border-indigo-900/40">
                    <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
                    <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                        Our support team is available Monday through Friday, 9AM to 6PM EST. 
                        We typically respond to all inquiries within 24-48 hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Back to Home
                        </Link>
                        {!user && (
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
                            >
                                Sign In for Faster Support
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
