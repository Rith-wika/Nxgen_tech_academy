import axiosInstance from "@/api/axiosInstance";

export interface LeadEnrollmentData {
    id?: number | string;
    lead: number | string;
    course: number | string;
    enrollment_date: string;
    fee_status: "Pending" | "Partially Paid" | "Fully Paid";
    status?: string;
    notes?: string;
    lead_name?: string;
    lead_email?: string;
    course_title?: string;
    created_at?: string;
    updated_at?: string;
}

export const enrollService = {
    createEnrollment: async (data: LeadEnrollmentData) => {
        const res = await axiosInstance.post('/api/enroll/enrollments/', data);
        return res.data;
    },

    getEnrollments: async (campaignId?: number | string) => {
        const params = campaignId ? { campaign_id: campaignId } : {};
        const res = await axiosInstance.get('/api/enroll/enrollments/', { params });
        return res.data;
    },

    getEnrollmentById: async (id: number | string) => {
        const res = await axiosInstance.get(`/api/enroll/enrollments/${id}/`);
        return res.data;
    },

    updateEnrollment: async (id: number | string, data: Partial<LeadEnrollmentData>) => {
        const res = await axiosInstance.put(`/api/enroll/enrollments/${id}/`, data);
        return res.data;
    },

    deleteEnrollment: async (id: number | string) => {
        const res = await axiosInstance.delete(`/api/enroll/enrollments/${id}/`);
        return res.data;
    },
};
