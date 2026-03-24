import axiosInstance from "@/api/axiosInstance";

export const courseService = {
    // Get all courses for dropdowns
    getAllCourses: async () => {
        try {
            const res = await axiosInstance.get('/api/courses/');
            return res.data;
        } catch (error) {
            console.error("Error fetching courses", error);
            throw error;
        }
    }
};
