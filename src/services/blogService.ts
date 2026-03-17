import axiosInstance from "@/api/axiosInstance";

export interface BlogPost {
    id?: number | string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string;
    status: string; // 'Published' | 'Draft' or 'Schedule'
    image_url?: string;
    video_url?: string;
    created_at?: string;
    author_name?: string;
    scheduled_date?: string;
    scheduled_time?: string;
}

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("access_token");
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    if (isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
    }
    return { headers };
};

export const blogService = {
    getAllBlogs: async (params?: any) => {
        try {
            const authConfig = getHeaders();
            const res = await axiosInstance.get('/api/blogs/admin/blogs/', { params, ...authConfig });
            return res.data;
        } catch (error) {
            console.error("Error fetching blogs", error);
            throw error;
        }
    },

    getBlogById: async (id: string | number) => {
        try {
            const res = await axiosInstance.get(`/api/blogs/admin/blogs/${id}/`);
            return res.data;
        } catch (error) {
            console.error("Error fetching blog", error);
            throw error;
        }
    },

    getBlogBySlug: async (slug: string) => {
        try {
            const res = await axiosInstance.get(`/api/blogs/admin/blogs/${slug}/`);
            return res.data;
        } catch (error) {
            console.error("Error fetching blog by slug", error);
            throw error;
        }
    },

    createBlog: async (data: any) => {
        try {
            const isMultipart = data instanceof FormData;
            const res = await axiosInstance.post('/api/blogs/admin/blogs/', data, getHeaders(isMultipart));
            return res.data;
        } catch (error) {
            console.error("Error creating blog", error);
            throw error;
        }
    },

    updateBlog: async (id: string | number, data: any) => {
        try {
            const isMultipart = data instanceof FormData;
            const res = await axiosInstance.put(`/api/blogs/admin/blogs/${id}/edit/`, data, getHeaders(isMultipart));
            return res.data;
        } catch (error) {
            console.error("Error updating blog", error);
            throw error;
        }
    },

    deleteBlog: async (id: string | number) => {
        try {
            const res = await axiosInstance.delete(`/api/blogs/admin/blogs/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error deleting blog", error);
            throw error;
        }
    }
};
