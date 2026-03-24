import axiosInstance from "@/api/axiosInstance";

export interface Lesson {
    id?: number;
    course: number | string;
    title: string;
    description?: string;
    order?: number;
    is_published?: boolean;
    created_at?: string;
}

export interface Topic {
    id?: number;
    lesson: number;
    title: string;
    description?: string;
    video_url?: string;
    video_file?: File;
    document?: File;
    duration?: string;
    order?: number;
    is_published?: boolean;
    created_at?: string;
}

const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
};

const getMultipartHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    };
};

export const lessonService = {
    // Get lessons for a course
    getCourseLessons: async (courseId: string | number) => {
        try {
            const res = await axiosInstance.get(`/api/instructor/courses/${courseId}/lessons/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching lessons", error);
            throw error;
        }
    },

    // Create a lesson
    createLesson: async (data: Lesson) => {
        try {
            const res = await axiosInstance.post('/api/instructor/lessons/', data, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error creating lesson", error);
            throw error;
        }
    },

    // Update a lesson
    updateLesson: async (id: number, data: Partial<Lesson>) => {
        try {
            const res = await axiosInstance.patch(`/api/instructor/lessons/${id}/`, data, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error updating lesson", error);
            throw error;
        }
    },

    // Delete a lesson
    deleteLesson: async (id: number) => {
        try {
            const res = await axiosInstance.delete(`/api/instructor/lessons/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error deleting lesson", error);
            throw error;
        }
    },

    // Get topics for a lesson
    getLessonTopics: async (lessonId: number) => {
        try {
            const res = await axiosInstance.get(`/api/instructor/lessons/${lessonId}/topics/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching topics", error);
            throw error;
        }
    },

    // Create a topic
    createTopic: async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            const res = await axiosInstance.post('/api/instructor/topics/', formData, getMultipartHeaders());
            return res.data;
        } catch (error) {
            console.error("Error creating topic", error);
            throw error;
        }
    },

    // Update a topic
    updateTopic: async (id: number, data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            const res = await axiosInstance.patch(`/api/instructor/topics/${id}/`, formData, getMultipartHeaders());
            return res.data;
        } catch (error) {
            console.error("Error updating topic", error);
            throw error;
        }
    },

    // Delete a topic
    deleteTopic: async (id: number) => {
        try {
            const res = await axiosInstance.delete(`/api/instructor/topics/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error deleting topic", error);
            throw error;
        }
    }
};
