import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Get curated tech/education thumbnails
    const generateThumbnail = () => {
        if (!formData.category) {
            toast.error("Please select a category first");
            return;
        }

        setGeneratingThumbnail(true);

        // Curated professional course thumbnails by category
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

        setFormData({ ...formData, thumbnail: thumbnailUrl });
        toast.success("Thumbnail selected!");
        setGeneratingThumbnail(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/courses",
                formData,
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success("Course created successfully!");
                navigate("/instructor/dashboard");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-white">
                                Create New Course
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Fill in the details to create a new course. You can add sections and lessons later.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <div className="shadow-xl rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
                                <div className="px-4 py-5 space-y-6 sm:p-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                                            Course Title
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                required
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white placeholder-gray-500"
                                                placeholder="e.g. Advanced React Patterns"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                            Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={3}
                                                required
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white placeholder-gray-500"
                                                placeholder="Brief description of the course..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-6 gap-6">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                id="category"
                                                required
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white placeholder-gray-500"
                                                placeholder="0 for free"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300">
                                            Thumbnail
                                        </label>
                                        <div className="mt-1 space-y-3">
                                            {/* Thumbnail Preview */}
                                            {formData.thumbnail && (
                                                <div className="relative rounded-xl overflow-hidden border border-gray-700">
                                                    <img 
                                                        src={formData.thumbnail} 
                                                        alt="Thumbnail preview" 
                                                        className="w-full h-40 object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
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
                                                            onClick={() => setFormData({ ...formData, thumbnail: "" })}
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
                                                    className={`w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all ${generatingThumbnail ? 'opacity-75 cursor-wait' : ''} ${!formData.category ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-px bg-gray-700"></div>
                                                <span className="text-xs text-gray-500">or paste URL</span>
                                                <div className="flex-1 h-px bg-gray-700"></div>
                                            </div>
                                            
                                            <input
                                                type="url"
                                                name="thumbnail"
                                                id="thumbnail"
                                                required
                                                value={formData.thumbnail}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white placeholder-gray-500"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Select a category first, then click to get a professional stock photo
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 py-4 bg-gray-800 border-t border-gray-700 text-right sm:px-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${loading ? "opacity-75 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {loading ? "Creating..." : "Create Course"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
