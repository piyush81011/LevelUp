import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        thumbnail: "",
    });

    const categories = [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Design",
        "Business",
        "Marketing",
        "Other",
    ];

    // Get curated tech/education thumbnails
    const generateThumbnail = () => {
        if (!formData.category) {
            toast.error("Please select a category first");
            return;
        }

        setGeneratingThumbnail(true);

        const categoryImages = {
            "Web Development": [
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=1280&h=720&fit=crop",
            ],
            "Mobile Development": [
                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1280&h=720&fit=crop",
            ],
            "Data Science": [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1280&h=720&fit=crop",
            ],
            "Machine Learning": [
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1280&h=720&fit=crop",
            ],
            "DevOps": [
                "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1280&h=720&fit=crop",
            ],
            "Design": [
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=1280&h=720&fit=crop",
            ],
            "Business": [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop",
            ],
            "Marketing": [
                "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1280&h=720&fit=crop",
            ],
            "Other": [
                "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1280&h=720&fit=crop",
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1280&h=720&fit=crop",
            ],
        };

        const images = categoryImages[formData.category] || categoryImages["Other"];
        const randomIndex = Math.floor(Math.random() * images.length);
        const thumbnailUrl = images[randomIndex];

        setFormData(prev => ({ ...prev, thumbnail: thumbnailUrl }));
        toast.success("Thumbnail selected!");
        setGeneratingThumbnail(false);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/courses/${courseId}`,
                    { withCredentials: true }
                );
                const course = response.data.data;
                setFormData({
                    title: course.title || "",
                    description: course.description || "",
                    category: course.category || "",
                    price: course.price?.toString() || "",
                    thumbnail: course.thumbnail || "",
                });
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch course");
                navigate("/instructor/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.put(
                `${API_BASE_URL}/api/v1/courses/${courseId}`,
                {
                    ...formData,
                    price: parseFloat(formData.price),
                },
                { withCredentials: true }
            );
            toast.success("Course updated successfully!");
            navigate("/instructor/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/instructor/dashboard"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                    <p className="text-gray-500 mt-1">Update your course details</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    {/* Title */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Complete React Developer Course"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Describe what students will learn in this course..."
                            required
                        />
                    </div>

                    {/* Category & Price Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="0.00"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Set to 0 for a free course</p>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-8">
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail <span className="text-red-500">*</span>
                        </label>

                        {/* Thumbnail Preview */}
                        {formData.thumbnail && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
                                <img
                                    src={formData.thumbnail}
                                    alt="Course thumbnail"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={generateThumbnail}
                                        disabled={generatingThumbnail}
                                        className="p-2 bg-indigo-500/90 hover:bg-indigo-500 rounded-lg transition-colors"
                                        title="Get different image"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: "" }))}
                                        className="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        {!formData.thumbnail && (
                            <button
                                type="button"
                                onClick={generateThumbnail}
                                disabled={generatingThumbnail || !formData.category}
                                className={`w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all mb-3 ${generatingThumbnail ? 'opacity-75 cursor-wait' : ''} ${!formData.category ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {generatingThumbnail ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Finding perfect image...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Generate Professional Thumbnail</span>
                                    </>
                                )}
                            </button>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400">or paste URL</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <input
                            type="url"
                            id="thumbnail"
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Select a category, then click to get a professional stock photo
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                        <Link
                            to="/instructor/dashboard"
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>

                {/* Manage Content Section */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Content</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Manage sections and lessons for this course
                    </p>
                    <Link
                        to={`/instructor/course/${courseId}/manage`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Manage Sections & Lessons
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
