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
    status?: "pending" | "approved" | "rejected";
    created_at?: string;
    terms_accepted?: boolean;
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
            const res = await axiosInstance.post('/api/enrollments/Student/', data);
            return res.data;
        } catch (error) {
            console.error("Error submitting enrollment", error);
            throw error;
        }
    },

    // For admin to list all enrollments
    getAllEnrollments: async () => {
        try {
            const res = await axiosInstance.get('/api/enrollments/', getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching enrollments", error);
            throw error;
        }
    },

    // Admin: Approve enrollment
    approveEnrollment: async (id: number | string) => {
        try {
            const res = await axiosInstance.post(`/api/enrollments/${id}/approve/`, {}, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error approving enrollment", error);
            throw error;
        }
    },

    // Admin: Reject enrollment
    rejectEnrollment: async (id: number | string) => {
        try {
            const res = await axiosInstance.post(`/api/enrollments/${id}/reject/`, {}, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error rejecting enrollment", error);
            throw error;
        }
    },

    // Get single student details
    getEnrollmentById: async (id: number | string) => {
        try {
            const res = await axiosInstance.get(`/api/enrollments/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching enrollment detail", error);
            throw error;
        }
    },

    // Update student
    updateEnrollment: async (id: number | string, data: Partial<EnrollmentData>) => {
        try {
            const res = await axiosInstance.put(`/api/enrollments/${id}/`, data, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error updating enrollment", error);
            throw error;
        }
    },

    // Delete student
    deleteEnrollment: async (id: number | string) => {
        try {
            const res = await axiosInstance.delete(`/api/enrollments/${id}/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error deleting enrollment", error);
            throw error;
        }
    }
};
