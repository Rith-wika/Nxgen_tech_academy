import axiosInstance from "@/api/axiosInstance";

export interface LeadEnrollmentData {
    id?: number | string;
    lead: number | string;
    course: number | string;
    enrollment_date: string;
    fee_status: "Pending" | "Partially Paid" | "Fully Paid";
    qualification: string;
    current_status: string;
    preferred_mode: string;
    preferred_batch_timing: string;
    experience_level: string;
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

    // Lead Conversion Endpoints (Campaigns)
    getLeadCourseTypes: async () => {
        const res = await axiosInstance.get('/api/enroll/course-types/');
        return res.data;
    },
    getLeadCurrentStatuses: async () => {
        const res = await axiosInstance.get('/api/enroll/current-status/');
        return res.data;
    },
    getLeadModes: async () => {
        const res = await axiosInstance.get('/api/enroll/modes/');
        return res.data;
    },
    getLeadTimings: async () => {
        const res = await axiosInstance.get('/api/enroll/timings/');
        return res.data;
    },
    getLeadExperienceLevels: async () => {
        const res = await axiosInstance.get('/api/enroll/experience-levels/');
        return res.data;
    },
    getLeadFeeStatuses: async () => {
        const res = await axiosInstance.get('/api/enroll/fee-statuses/');
        return res.data;
    },

    // Direct Student Enrollment Endpoints
    getStudentCourseTypes: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/course-type/');
        return res.data;
    },
    getStudentCurrentStatuses: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/current-status/');
        return res.data;
    },
    getStudentModes: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/mode/');
        return res.data;
    },
    getStudentTimings: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/timing/');
        return res.data;
    },
    getStudentExperienceLevels: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/experience/');
        return res.data;
    },
    getStudentFeeStatuses: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/fee-status/');
        return res.data;
    },
    getStudentEnrollmentStatuses: async () => {
        const res = await axiosInstance.get('/api/enrollments/choices/status/');
        return res.data;
    },

    getAttendedLeads: async (demoId: number | string) => {
        const res = await axiosInstance.get(`/api/enroll/attended-leads/?demo_id=${demoId}`);
        return res.data;
    },
};
