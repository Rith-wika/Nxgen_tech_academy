import axiosInstance from "@/api/axiosInstance";
import { courses } from "@/data/courses";

export const courseService = {
    // Get all courses for dropdowns
    getAllCourses: async () => {
        try {
            console.log("Attempting to fetch courses from API...");
            const res = await axiosInstance.get('/api/courses/');
            console.log("API courses response:", res.data);
            
            // Normalize response - handle both array and paginated format
            const data = Array.isArray(res.data) ? res.data : (res.data.results || res.data);
            
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("API returned empty or invalid data, falling back to mock data");
                return courses;
            }
            
            return data;
        } catch (error: any) {
            console.error("Error fetching courses from API:", {
                message: error?.message,
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                url: error?.config?.url,
                errorData: error?.response?.data
            });
            
            // Fallback to mock data on any error
            console.warn("Using fallback mock course data");
            return courses;
        }
    }
};
