import axiosInstance from "@/api/axiosInstance";

export const courseService = {
    // Get all courses for dropdowns
    getAllCourses: async () => {
        try {
            console.log("Attempting to fetch courses from API...");
            const res = await axiosInstance.get('/api/courses/courses/');
            console.log("API courses response:", res.data);

            // Normalize response - handle both array and paginated format
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            const normalizedCourses = data.map((course: any) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                price: course.price,
                is_active: course.is_active,
                category: course.category,
                instructor: course.instructor,
            }));

            return normalizedCourses;
        } catch (error: any) {
            console.error("Error fetching courses from API:", {
                message: error?.message,
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                url: error?.config?.url,
                errorData: error?.response?.data
            });
            throw error;
        }
    },
    // Get secure temporary access URL for files
    getFileAccessUrl: async (type: string, id: number | string) => {
        try {
            const res = await axiosInstance.get('/api/courses/files/access/', {
                params: { type, id }
            });
            return res.data.signed_url;
        } catch (error) {
            console.error("Error fetching file access URL", error);
            throw error;
        }
    }
};