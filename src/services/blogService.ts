import axiosInstance from "@/api/axiosInstance";

export interface BlogPost {
    id?: number | string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string | number;
    category_id?: number;
    tags: string;
    tag_ids?: number[];
    status: string; // 'Published' | 'Draft' or 'Schedule'
    image_url?: string;
    video_url?: string;
    featured_image?: string;
    video?: string;
    created_at?: string;
    author_name?: string;
    scheduled_date?: string;
    scheduled_time?: string;
}

export interface BlogCategoryOption {
    id: number;
    name: string;
    slug: string;
}

export interface BlogTagOption {
    id: number;
    name: string;
}

export interface BlogCategoryCreateResponse {
    created: boolean;
    detail: string;
    category: BlogCategoryOption;
}

const normalizeBlog = (raw: any): BlogPost => {
    const categoryObj = raw?.category;
    const tags = Array.isArray(raw?.tags) ? raw.tags : [];

    return {
        ...raw,
        category: categoryObj?.value || categoryObj?.name || raw?.category || "",
        category_id: categoryObj?.id,
        tags: tags.map((t: any) => t?.value || t?.name || t).filter(Boolean).join(", "),
        tag_ids: tags.map((t: any) => t?.id).filter((id: any) => typeof id === "number"),
        image_url: raw?.featured_image || raw?.image_url || "",
        video_url: raw?.video || raw?.video_url || "",
    };
};

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
            if (Array.isArray(res.data?.results)) {
                return {
                    ...res.data,
                    results: res.data.results.map(normalizeBlog),
                };
            }

            if (Array.isArray(res.data)) {
                return res.data.map(normalizeBlog);
            }

            return res.data;
        } catch (error) {
            console.error("Error fetching blogs", error);
            throw error;
        }
    },

    getPublicBlogs: async () => {
        try {
            const res = await axiosInstance.get('/api/blogs/');
            return Array.isArray(res.data) ? res.data.map(normalizeBlog) : [];
        } catch (error) {
            console.error("Error fetching public blogs", error);
            throw error;
        }
    },

    getBlogById: async (id: string | number) => {
        try {
            const res = await axiosInstance.get(`/api/blogs/admin/blogs/${id}/`);
            return normalizeBlog(res.data);
        } catch (error) {
            console.error("Error fetching blog", error);
            throw error;
        }
    },

    getBlogBySlug: async (slug: string) => {
        try {
            const res = await axiosInstance.get(`/api/blogs/${slug}/`);
            return normalizeBlog(res.data);
        } catch (error) {
            console.error("Error fetching blog by slug", error);
            throw error;
        }
    },

    getMeta: async (): Promise<{ categories: BlogCategoryOption[]; tags: BlogTagOption[] }> => {
        try {
            const res = await axiosInstance.get('/api/blogs/admin/meta/', getHeaders());
            return {
                categories: res.data?.categories || [],
                tags: res.data?.tags || [],
            };
        } catch (error) {
            console.error("Error fetching blog meta", error);
            throw error;
        }
    },

    getCategories: async (): Promise<BlogCategoryOption[]> => {
        try {
            const res = await axiosInstance.get('/api/blogs/admin/categories/', getHeaders());
            return Array.isArray(res.data) ? res.data : [];
        } catch (error) {
            console.error("Error fetching blog categories", error);
            throw error;
        }
    },

    createCategory: async (name: string): Promise<BlogCategoryCreateResponse> => {
        try {
            const res = await axiosInstance.post('/api/blogs/admin/categories/', { name }, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error creating blog category", error);
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
