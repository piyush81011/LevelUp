import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Certificate = () => {
    const { courseId } = useParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const certificateRef = useRef(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/enrollments/${courseId}/certificate`,
                    { withCredentials: true }
                );
                setCertificate(response.data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch certificate");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [courseId]);

    const handleDownload = async () => {
        if (!certificateRef.current) {
            toast.error("Certificate not ready");
            return;
        }
        
        setDownloading(true);
        
        try {
            // Dynamically import html2canvas
            const html2canvasModule = await import("html2canvas");
            const html2canvas = html2canvasModule.default;
            
            // Get the certificate element
            const element = certificateRef.current;
            
            // Create canvas with explicit options
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: "#111827",
                useCORS: true,
                logging: false,
                allowTaint: true,
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });
            
            // Use toDataURL for simpler conversion
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            
            // Create download link
            const link = document.createElement("a");
            link.download = `LevelUp-Certificate-${certificate.certificateId}.png`;
            link.href = dataUrl;
            link.click();
            
            toast.success("Certificate downloaded!");
            setDownloading(false);
        } catch (error) {
            console.error("Download error:", error);
            setDownloading(false);
            
            // Fallback: Open print dialog
            const usePrint = window.confirm(
                "Download failed. Would you like to use Print to PDF instead?\n\n" +
                "Click OK to open print dialog (select 'Save as PDF' as destination)"
            );
            
            if (usePrint) {
                window.print();
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Certificate Not Found</h2>
                <p className="text-gray-400 mb-6">You need to complete the course first to get your certificate.</p>
                <Link 
                    to={`/course/${courseId}/learn`}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                >
                    Continue Learning
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link 
                            to="/student/dashboard" 
                            className="text-gray-400 hover:text-white flex items-center gap-2 mb-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Your Certificate</h1>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Certificate
                            </>
                        )}
                    </button>
                </div>

                {/* Certificate */}
                <div 
                    ref={certificateRef}
                    data-certificate="true"
                    id="certificate-container"
                    className="relative rounded-2xl p-1 shadow-2xl print:shadow-none"
                    style={{ backgroundColor: "#1f2937" }}
                >
                    <div 
                        className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
                        style={{ backgroundColor: "#111827" }}
                    >
                        {/* Border decorations - no blur for html2canvas compatibility */}
                        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-indigo-500 opacity-30 rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-purple-500 opacity-30 rounded-bl-3xl"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            {/* Logo & Header */}
                            <div className="flex justify-center mb-6">
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #9333ea 100%)" }}
                                >
                                    <span className="text-white font-bold text-2xl">L</span>
                                </div>
                            </div>
                            
                            <p style={{ color: "#818cf8" }} className="text-sm font-semibold tracking-widest uppercase mb-2">LevelUp</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Certificate</h2>
                            <p className="text-xl mb-8" style={{ color: "#9ca3af" }}>of Completion</p>

                            {/* Divider */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="h-px w-16" style={{ backgroundColor: "#6366f1" }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6366f1" }}></div>
                                <div className="h-px w-16" style={{ backgroundColor: "#6366f1" }}></div>
                            </div>

                            {/* Recipient */}
                            <p className="text-lg mb-2" style={{ color: "#9ca3af" }}>This is to certify that</p>
                            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#a5b4fc" }}>
                                {certificate.studentName}
                            </h3>

                            <p className="text-lg mb-2" style={{ color: "#9ca3af" }}>has successfully completed the course</p>
                            <h4 className="text-2xl md:text-3xl font-bold text-white mb-8">
                                {certificate.courseName}
                            </h4>

                            {/* Course Details */}
                            <div className="flex flex-wrap justify-center gap-8 mb-8">
                                <div className="text-center">
                                    <p className="text-sm mb-1" style={{ color: "#6b7280" }}>Category</p>
                                    <p className="text-white font-medium">{certificate.courseCategory}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm mb-1" style={{ color: "#6b7280" }}>Instructor</p>
                                    <p className="text-white font-medium">{certificate.instructorName}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm mb-1" style={{ color: "#6b7280" }}>Date Issued</p>
                                    <p className="text-white font-medium">{formattedDate}</p>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="h-px w-32" style={{ backgroundColor: "#374151" }}></div>
                                <svg className="w-8 h-8" style={{ color: "#6366f1" }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="h-px w-32" style={{ backgroundColor: "#374151" }}></div>
                            </div>

                            {/* Certificate ID */}
                            <div 
                                className="inline-block rounded-lg px-6 py-3 border"
                                style={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                            >
                                <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Certificate ID</p>
                                <p className="font-mono font-semibold tracking-wider" style={{ color: "#818cf8" }}>
                                    {certificate.certificateId}
                                </p>
                            </div>

                            <p className="text-sm mt-6" style={{ color: "#6b7280" }}>
                                Verify at: levelup.com/verify/{certificate.certificateId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Share Your Achievement</h3>
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(`I just completed "${certificate.courseName}" on LevelUp! Certificate ID: ${certificate.certificateId}`);
                                toast.success("Copied to clipboard!");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Link
                        </button>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://levelup.com/verify/${certificate.certificateId}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006699] text-white rounded-lg text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Share on LinkedIn
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just completed "${certificate.courseName}" on LevelUp! 🎉`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white rounded-lg text-sm transition-colors border border-gray-700"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Share on X
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
