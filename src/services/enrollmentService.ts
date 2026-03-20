import axiosInstance from "@/api/axiosInstance";

export interface EnrollmentData {
    id?: number | string;
    name: string;
    email: string;
    phone: string;
    course: number | string;
    course_type: string;
    qualification: string;
    current_status: string;
    collegeCompanyName: string;
    preferred_mode: string;
    preferred_timing: string;
    experience_level: string;
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

export const enrollmentService = {
    // For students to enroll
    enroll: async (data: EnrollmentData) => {
        try {
            const res = await axiosInstance.post('/api/enrollments/enroll/', data);
            return res.data;
        } catch (error) {
            console.error("Error submitting enrollment", error);
            throw error;
        }
    },

    // For admin to list all enrollments
    getAllEnrollments: async () => {
        try {
            const res = await axiosInstance.get('/api/enrollments/admin/enrollments/', getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching enrollments", error);
            throw error;
        }
    },

    // Optional: Get single enrollment details
    getEnrollmentById: async (id: number | string) => {
        try {
            const res = await axiosInstance.get(`/api/enrollments/admin/enrollments/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching enrollment detail", error);
            throw error;
        }
    }
};
