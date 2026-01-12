import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);

    // Form States
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");

    const [isAddingLesson, setIsAddingLesson] = useState(null); // sectionId
    const [lessonForm, setLessonForm] = useState({
        title: "",
        videoUrl: "",
        isFreePreview: false
    });

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/v1/courses/${courseId}`,
                { withCredentials: true }
            );
            setCourse(response.data.data);
        } catch (error) {
            toast.error("Failed to load course details");
            navigate("/instructor/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8000/api/v1/content/course/${courseId}/section`,
                { title: newSectionTitle },
                { withCredentials: true }
            );
            toast.success("Section added successfully");
            setNewSectionTitle("");
            setIsAddingSection(false);
            fetchCourseDetails(); // Refresh to show new section
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add section");
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Delete this section and all its lessons?")) return;
        try {
            await axios.delete(
                `http://localhost:8000/api/v1/content/section/${sectionId}`,
                { withCredentials: true }
            );
            toast.success("Section deleted");
            fetchCourseDetails();
        } catch (error) {
            toast.error("Failed to delete section");
        }
    };

    const handleCreateLesson = async (e, sectionId) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8000/api/v1/content/section/${sectionId}/lesson`,
                lessonForm,
                { withCredentials: true }
            );
            toast.success("Lesson added successfully");
            setLessonForm({ title: "", videoUrl: "", isFreePreview: false });
            setIsAddingLesson(null);
            fetchCourseDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add lesson");
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Delete this lesson?")) return;
        try {
            await axios.delete(
                `http://localhost:8000/api/v1/content/lesson/${lessonId}`,
                { withCredentials: true }
            );
            toast.success("Lesson deleted");
            fetchCourseDetails();
        } catch (error) {
            toast.error("Failed to delete lesson");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => navigate("/instructor/dashboard")}
                            className="text-gray-400 hover:text-white mb-2 flex items-center gap-1 text-sm"
                        >
                            &larr; Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-gray-400">Content Manager</p>
                    </div>
                    <button
                        onClick={() => setIsAddingSection(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                    >
                        + Add Section
                    </button>
                </div>

                {/* Add Section Form */}
                {isAddingSection && (
                    <div className="mb-8 bg-gray-800 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">New Section</h3>
                        <form onSubmit={handleCreateSection} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Section Title (e.g., Introduction)"
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-bold">Save</button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingSection(false)}
                                    className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sections List */}
                <div className="space-y-6">
                    {course.sections?.map((section, index) => (
                        <div key={section._id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                            {/* Section Header */}
                            <div className="p-6 flex items-center justify-between bg-gray-800 border-b border-gray-700">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-sm font-bold text-gray-400">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-xl font-bold">{section.title}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsAddingLesson(section._id)}
                                        className="text-sm bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors"
                                    >
                                        + Add Lesson
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSection(section._id)}
                                        className="text-gray-500 hover:text-red-400 p-2"
                                        title="Delete Section"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Add Lesson Form */}
                            {isAddingLesson === section._id && (
                                <div className="p-6 bg-gray-700/30 border-b border-gray-700">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Add New Lesson</h4>
                                    <form onSubmit={(e) => handleCreateLesson(e, section._id)} className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Lesson Title"
                                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={lessonForm.title}
                                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="url"
                                                placeholder="Video URL (e.g., YouTube embed link or MP4)"
                                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={lessonForm.videoUrl}
                                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`preview-${section._id}`}
                                                className="w-4 h-4 rounded bg-gray-900 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                                checked={lessonForm.isFreePreview}
                                                onChange={(e) => setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })}
                                            />
                                            <label htmlFor={`preview-${section._id}`} className="text-sm text-gray-300">Allow as Free Preview</label>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold">Add Lesson</button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingLesson(null)}
                                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-bold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Lessons List */}
                            <div className="divide-y divide-gray-700 bg-gray-800/50">
                                {section.lessons?.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm italic">
                                        No lessons in this section yet.
                                    </div>
                                ) : (
                                    section.lessons?.map((lesson) => (
                                        <div key={lesson._id} className="p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 flex justify-center text-gray-500">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{lesson.title}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-md">{lesson.videoUrl}</p>
                                                </div>
                                                {lesson.isFreePreview && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/20">
                                                        Preview
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson._id)}
                                                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {course.sections?.length === 0 && !isAddingSection && (
                    <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 border-dashed mt-8">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Start Building Your Curriculum</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Create sections to organize your content, then add lessons with video lectures.</p>
                        <button
                            onClick={() => setIsAddingSection(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            Create First Section
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourse;
