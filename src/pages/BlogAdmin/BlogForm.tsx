import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BlogCategoryOption, BlogPost, blogService } from "@/services/blogService";
import { useNavigate } from "react-router-dom";

interface BlogFormProps {
    initialData?: BlogPost;
    isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [metaLoading, setMetaLoading] = useState(true);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const quillRef = useRef<ReactQuill>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<BlogCategoryOption[]>([]);

    const [formData, setFormData] = useState<BlogPost>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "", // Kept for interface compatibility but hidden from UI
        status: "draft",
        scheduled_date: "",
        scheduled_time: "",
        image_url: "",
        video_url: "",
    });

    const loadMeta = async () => {
        try {
            setMetaLoading(true);
            const meta = await blogService.getMeta();
            setCategoryOptions(meta.categories || []);
        } catch {
            try {
                const categories = await blogService.getCategories();
                setCategoryOptions(categories);
            } catch {
                setCategoryOptions([]);
                toast.error("Failed to load blog categories.");
            }
        } finally {
            setMetaLoading(false);
        }
    };

    useEffect(() => {
        loadMeta();
    }, []);

    useEffect(() => {
        if (initialData) {
            const getVal = (v: any) => (v && typeof v === 'object') ? (v.value || v.name || v.id) : v;

            setFormData({
                ...initialData,
                category: initialData.category_id || getVal(initialData.category) || "",
                status: getVal(initialData.status)?.toString().toLowerCase() || "draft",
                tags: initialData.tags || "",
                title: getVal(initialData.title) || "",
                slug: getVal(initialData.slug) || "",
            });
        }
    }, [initialData]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
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
            const normalizedStatus = formData.status === "schedule" ? "scheduled" : formData.status;

            const payload: Record<string, string> = {
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt || "",
                category: String(formData.category || ""),
                status: normalizedStatus,
            };

            if (normalizedStatus === "scheduled" && formData.scheduled_date && formData.scheduled_time) {
                payload.publish_at = `${formData.scheduled_date}T${formData.scheduled_time}:00`;
            }

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== "") {
                    submitData.append(key, value);
                }
            });

            if (imageFile) submitData.append('featured_image', imageFile);
            if (videoFile) submitData.append('video', videoFile);

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
            toast.error(error.response?.data?.detail || error.message || "Failed to save blog post.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        const name = newCategoryName.replace(/\s+/g, " ").trim();
        if (!name) {
            toast.error("Please enter a category name.");
            return;
        }
        try {
            setCreatingCategory(true);
            const result = await blogService.createCategory(name);
            const category = result?.category;
            setNewCategoryName("");
            await loadMeta();
            if (category?.id) {
                setFormData((prev) => ({ ...prev, category: category.id }));
            }
            toast.success(result?.detail || "Category processed.");
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || "Failed to create category.");
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleUndo = () => quillRef.current?.getEditor().history.undo();
    const handleRedo = () => quillRef.current?.getEditor().history.redo();

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
        history: { delay: 1000, maxStack: 100, userOnly: true }
    }), []);

    const normalizedCategoryName = newCategoryName.replace(/\s+/g, " ").trim();
    const canSubmitCategory = !creatingCategory && normalizedCategoryName.length > 0 && normalizedCategoryName.length <= 150;

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
                        <option value="">{metaLoading ? "Loading categories..." : "Select Category..."}</option>
                        {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Add new category"
                            className="h-10 bg-slate-50 border-slate-200"
                        />
                        <Button type="button" variant="outline" className="h-10" onClick={handleCreateCategory} disabled={!canSubmitCategory}>
                            {creatingCategory ? "Adding..." : "Add"}
                        </Button>
                    </div>
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
                        <div className="space-y-3">
                            <Label htmlFor="scheduled_date" className="text-sm font-semibold text-slate-700">Schedule Date <span className="text-red-500">*</span></Label>
                            <Input id="scheduled_date" name="scheduled_date" type="date" value={formData.scheduled_date} onChange={handleInputChange} required className="h-12 bg-slate-50 border-slate-200 focus:ring-[#000080]" />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="scheduled_time" className="text-sm font-semibold text-slate-700">Schedule Time <span className="text-red-500">*</span></Label>
                            <Input id="scheduled_time" name="scheduled_time" type="time" value={formData.scheduled_time} onChange={handleInputChange} required className="h-12 bg-slate-50 border-slate-200 focus:ring-[#000080]" />
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-8">
                <div className="space-y-3">
                    <Label htmlFor="imageFile" className="text-sm font-semibold text-slate-700">Upload Featured Image</Label>
                    <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="h-12 bg-slate-50 border-slate-200 pt-3 cursor-pointer" />
                    {isEdit && formData.image_url && <p className="text-xs text-slate-500 mt-1 truncate">Current: {formData.image_url}</p>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="videoFile" className="text-sm font-semibold text-slate-700">Upload Video (Optional)</Label>
                    <Input id="videoFile" name="videoFile" type="file" accept="video/*" onChange={handleFileChange} className="h-12 bg-slate-50 border-slate-200 pt-3 cursor-pointer" />
                    {isEdit && formData.video_url && <p className="text-xs text-slate-500 mt-1 truncate">Current: {formData.video_url}</p>}
                </div>
                <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">Short Description / Excerpt</Label>
                    <Input id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} className="h-12 bg-slate-50 border-slate-200" placeholder="A brief 1-2 sentence summary of this post." />
                </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <Label className="text-sm font-semibold text-slate-700 sm:text-lg">Blog Content <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2 bg-slate-100 rounded-md p-1 border">
                        <button type="button" onClick={handleUndo} className="px-3 py-1 bg-white hover:bg-slate-200 rounded text-sm font-medium shadow-sm transition-all">Undo</button>
                        <button type="button" onClick={handleRedo} className="px-3 py-1 bg-white hover:bg-slate-200 rounded text-sm font-medium shadow-sm transition-all">Redo</button>
                    </div>
                </div>
                <div className="bg-white rounded-lg ring-1 ring-slate-200 overflow-hidden min-h-[400px]">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleEditorChange}
                        modules={modules}
                        style={{ minHeight: '350px' }}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end pt-8 gap-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => navigate("/blog-admin/blogs")} className="w-full sm:w-auto h-12 px-8 font-medium">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#000080] hover:bg-[#000080]/90 text-white h-12 px-8 font-medium shadow-md" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Blog"}
                </Button>
            </div>
        </form>
    );
}
