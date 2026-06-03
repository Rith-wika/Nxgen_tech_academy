import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { blogService } from '@/services/blogService';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

export default function BlogList() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<any | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await blogService.getAllBlogs();
            // Handle cases where data is paginated or not
            const fetchedBlogs = data?.results || data || [];
            if (Array.isArray(fetchedBlogs)) {
                setBlogs(fetchedBlogs);
            } else {
                setBlogs([]);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to load blogs from API.");
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (blog: any) => {
        setBlogToDelete(blog);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!blogToDelete) return;
        try {
            await blogService.deleteBlog(blogToDelete.id);
            toast.success("Blog deleted successfully!");
            fetchBlogs();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to delete blog. Please try again.");
        } finally {
            setIsDeleteDialogOpen(false);
            setBlogToDelete(null);
        }
    };

    const renderSafe = (val: any) => {
        if (val && typeof val === 'object') {
            return val.value || val.name || val.id || JSON.stringify(val);
        }
        return val;
    };

    const filteredBlogs = blogs.filter((blog) => {
        const title = renderSafe(blog.title)?.toString().toLowerCase();
        const s = title?.includes(search.toLowerCase());
        const status = renderSafe(blog.status);
        const f = statusFilter === 'All' || status === statusFilter || blog.status === statusFilter;
        return s && f;
    });

    return (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 min-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-4">
                <h1 className="text-2xl font-bold text-slate-800">Manage Blogs</h1>
                <Link
                    to="/blog-admin/create-blog"
                    className="bg-[#000080] hover:bg-[#000080]/90 text-white px-6 py-2.5 rounded-md font-medium shadow-sm transition-all"
                >
                    Create New Blog
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white transition-all"
                    />
                </div>
                <div className="flex gap-2 items-center w-full md:w-auto">
                    <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                    <select
                        className="w-full md:w-auto border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:bg-white transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Schedule">Schedule</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date created</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500">Loading blogs...</td>
                            </tr>
                        ) : filteredBlogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500">No blogs found.</td>
                            </tr>
                        ) : (
                            filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{renderSafe(blog.title)}</td>
                                    <td className="px-6 py-4 text-slate-600">{renderSafe(blog.category) || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const status = renderSafe(blog.status);
                                            const statusLower = status?.toString().toLowerCase();
                                            const isPublished = statusLower === 'published';
                                            const isScheduled = statusLower === 'schedule' || statusLower === 'scheduled';
                                            
                                            let badgeClass = "bg-slate-200 text-slate-700 border border-slate-300";
                                            if (isPublished) badgeClass = "bg-green-100 text-green-700 border border-green-200";
                                            if (isScheduled) badgeClass = "bg-blue-100 text-blue-700 border border-blue-200";

                                            return (
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
                                                    {status || 'Draft'}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Unknown Date'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link to={`/blog-admin/edit/${blog.id}`} className="text-blue-600 hover:text-blue-900 transition-colors bg-blue-50 p-2 rounded-md hover:bg-blue-100">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDeleteClick(blog)} className="text-red-600 hover:text-red-900 transition-colors bg-red-50 p-2 rounded-md hover:bg-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Blog"
                description={`Are you sure you want to delete the blog "${blogToDelete ? renderSafe(blogToDelete.title) : 'this blog'}"? This action cannot be undone.`}
            />
        </div>
    );
}
