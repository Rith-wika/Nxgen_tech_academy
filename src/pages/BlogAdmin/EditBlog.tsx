import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogForm from './BlogForm';
import { BlogPost, blogService } from '@/services/blogService';
import { toast } from 'sonner';

export default function EditBlog() {
    const { id } = useParams<{ id: string }>();
    const [initialData, setInitialData] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = useCallback(async () => {
        try {
            setLoading(true);
            const data = await blogService.getBlogById(id!);
            setInitialData(data);
        } catch (error: unknown) {
            const message =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as { response?: { data?: { detail?: string } } }).response?.data?.detail === 'string'
                    ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
                    : 'Failed to fetch blog.';
            toast.error(message);
            setInitialData(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    if (loading) {
        return <div className="p-12 text-center text-slate-500 text-lg">Loading Blog Editor...</div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 max-w-5xl mx-auto min-h-[80vh]">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8 border-b border-slate-100 pb-4">Edit Blog Post</h1>
            {initialData && <BlogForm isEdit={true} initialData={initialData} />}
        </div>
    );
}
