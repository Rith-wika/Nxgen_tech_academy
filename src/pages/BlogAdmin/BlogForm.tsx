import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BlogPost, blogService } from "@/services/blogService";
import { useNavigate } from "react-router-dom";

interface BlogFormProps {
    initialData?: BlogPost;
    isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const quillRef = useRef<ReactQuill>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<BlogPost>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        status: "draft",
        scheduled_date: "",
        scheduled_time: "",
        image_url: "",
        video_url: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // Handle auto-generating slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''); // Auto generate slug
        setFormData({ ...formData, title, slug });
    };

    const handleEditorChange = (content: string) => {
        setFormData({ ...formData, content });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (e.target.name === 'imageFile') setImageFile(file);
            if (e.target.name === 'videoFile') setVideoFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error("Please fill required fields (Title and Content).");
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'image_url' && key !== 'video_url' && key !== 'tags' && value !== undefined && value !== null) {
                    submitData.append(key, String(value));
                }
            });

            // If tags is a comma-separated list of IDs, we send them individually for many-to-many fields
            // if (formData.tags) {
            //     const tagList = formData.tags.split(',').map(tag => tag.trim());
            //     // Depending on your backend, you may need to map strings back to IDs if your DRF serializers expect Primary Keys. 
            //     // Currently, appending as a list so DRF can read `request.data.getlist('tags')`.
            //     tagList.forEach(tag => {
            //         submitData.append('tags', tag);
            //     });
            // }

            if (imageFile) {
                submitData.append('image_url', imageFile);
            } else if (formData.image_url) {
                submitData.append('image_url', formData.image_url);
            }

            if (videoFile) {
                submitData.append('video_url', videoFile);
            } else if (formData.video_url) {
                submitData.append('video_url', formData.video_url);
            }

            if (isEdit && initialData?.id) {
                await blogService.updateBlog(initialData.id, submitData);
                toast.success("Blog updated successfully!");
            } else {
                await blogService.createBlog(submitData);
                toast.success("Blog created successfully!");
            }
            navigate("/blog-admin/blogs");
        } catch (error: any) {
            console.error("API Error detailed:", error.response?.data || error.message);
            toast.error(error.response?.data?.detail || error.message || "Failed to save blog post. Please check your network and API endpoint.");
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.undo();
        }
    };

    const handleRedo = () => {
        const editor = quillRef.current?.getEditor();
        if (editor) {
            editor.history.redo();
        }
    };

    const modules = React.useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['code-block'],
            ['clean']
        ],
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true
        }
    }), []);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white max-w-5xl w-full mx-auto md:p-6 p-4 border rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Blog Title <span className="text-red-500">*</span></Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleTitleChange} required className="h-12 bg-slate-50 border-slate-200 focus:ring-[#000080]" placeholder="Enter Blog Title" />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">Blog Slug (URL)</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required className="h-12 bg-slate-100 border-slate-200 text-slate-600 block read-only:" />
                    <p className="text-xs text-slate-400 mt-1">This is auto-generated based on the title.</p>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category <span className="text-red-500">*</span></Label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full h-12 border border-slate-200 bg-slate-50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#000080]"
                        required
                    >
                        <option value="">Select Category...</option>
                        {/* UPDATE CAUTION: These values MUST be the integer IDs from your backend Category model. 
                            E.g. <option value="1">SAP</option> 
                            I've set them as dummy IDs 1 to 6 below, you must match them with your DB.  */}
                        <option value="SAP">SAP</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Python">Python</option>
                        <option value="AIML">AIML</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700">Publish Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full h-12 border border-slate-200 bg-slate-50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#000080]"
                    >
                        <option value="draft">Draft (Save for later)</option>

                        <option value="published">Published (Live instantly)</option>
                        <option value="schedule">Schedule</option>
                    </select>
                </div>

                {formData.status === "schedule" && (
                    <>
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="scheduled_date" className="text-sm font-semibold text-slate-700">Schedule Date <span className="text-red-500">*</span></Label>
                            <Input
                                id="scheduled_date"
                                name="scheduled_date"
                                type="date"
                                value={formData.scheduled_date}
                                onChange={handleInputChange}
                                required
                                className="h-12 bg-slate-50 border-slate-200 focus:ring-[#000080]"
                            />
                        </div>
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="scheduled_time" className="text-sm font-semibold text-slate-700">Schedule Time <span className="text-red-500">*</span></Label>
                            <Input
                                id="scheduled_time"
                                name="scheduled_time"
                                type="time"
                                value={formData.scheduled_time}
                                onChange={handleInputChange}
                                required
                                className="h-12 bg-slate-50 border-slate-200 focus:ring-[#000080]"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-8">
                <div className="space-y-3">
                    <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">Tags (comma separated IDs)</Label>
                    {/* IMPORTANT: Because your backend expects Primary Keys for tags, you must input integer IDs (e.g. "1, 2, 3"). 
                        If you want to use strings, you must alter your Django models/serializers. */}
                    <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} className="h-12 bg-slate-50 border-slate-200" placeholder="e.g. 1, 2, 3" />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="imageFile" className="text-sm font-semibold text-slate-700">Upload Featured Image</Label>
                    <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="h-12 bg-slate-50 border-slate-200 pt-3 cursor-pointer" />
                    {isEdit && formData.image_url && <p className="text-xs text-slate-500 mt-1">Current image: {formData.image_url}</p>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="videoFile" className="text-sm font-semibold text-slate-700">Upload Video (Optional)</Label>
                    <Input id="videoFile" name="videoFile" type="file" accept="video/*" onChange={handleFileChange} className="h-12 bg-slate-50 border-slate-200 pt-3 cursor-pointer" />
                    {isEdit && formData.video_url && <p className="text-xs text-slate-500 mt-1">Current video: {formData.video_url}</p>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">Short Description / Excerpt</Label>
                    <Input id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} className="h-12 bg-slate-50 border-slate-200" placeholder="A brief 1-2 sentence summary of this post." />
                </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <Label className="text-sm font-semibold text-slate-700 sm:text-lg">Blog Content (Rich Text Editor) <span className="text-red-500">*</span></Label>

                    {/* Custom Undo Redo actions to satisfy requirements explicitly */}
                    <div className="flex gap-2 bg-slate-100 rounded-md p-1 border">
                        <button type="button" onClick={handleUndo} className="px-3 py-1 bg-white hover:bg-slate-200 rounded text-sm font-medium shadow-sm transition-all" title="Undo (Ctrl+Z)">Undo</button>
                        <button type="button" onClick={handleRedo} className="px-3 py-1 bg-white hover:bg-slate-200 rounded text-sm font-medium shadow-sm transition-all" title="Redo (Ctrl+Y)">Redo</button>
                    </div>
                </div>

                <div className="bg-white rounded-lg ring-1 ring-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleEditorChange}
                        modules={modules}
                        className="flex-1 flex flex-col h-full bg-white text-base"
                        style={{ minHeight: '400px' }}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end pt-8 gap-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => navigate("/blog-admin/blogs")} className="w-full sm:w-auto h-12 px-8 font-medium">
                    Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#000080] hover:bg-[#000080]/90 text-white h-12 px-8 font-medium shadow-md" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Blog"}
                </Button>
            </div>
        </form>
    );
}
