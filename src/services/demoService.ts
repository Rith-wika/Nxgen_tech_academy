import axiosInstance from '@/api/axiosInstance';

export interface Participant {
    id: number;
    name?: string;
    fullname?: string;
    attended: boolean;
    rescheduled?: boolean;
}

export interface Demo {
    id?: number;
    campaign: string;
    instructor: string;
    date: string;
    time: string;
    status: string;
    link: string;
    participants?: Participant[];
}

export const demoService = {
    // Schedule a new demo
    scheduleDemo: async (data: any) => {
        const response = await axiosInstance.post('/api/demo/schedule/', data);
        return response.data;
    },

    // Get all scheduled demos
    getAllDemos: async () => {
        const response = await axiosInstance.get('/api/demo/');
        return response.data;
    },

    // Get single demo details
    getDemo: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/`);
        return response.data;
    },

    // Update demo details (e.g., attendance or status)
    updateDemo: async (id: number | string, data: any) => {
        const response = await axiosInstance.put(`/api/demo/${id}/`, data);
        return response.data;
    },

    // Delete a demo
    deleteDemo: async (id: number | string) => {
        const response = await axiosInstance.delete(`/api/demo/${id}/`);
        return response.data;
    },

    // Get leads for a specific demo
    getDemoLeads: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/leads/`);
        return response.data;
    },

    // Post attendance for a demo
    postAttendance: async (id: number | string, attendanceData: any) => {
        const response = await axiosInstance.post(`/api/demo/${id}/attendance/`, attendanceData);
        return response.data;
    },

    // Reschedule absent participants
    rescheduleDemo: async (id: number | string, data: any) => {
        const response = await axiosInstance.post(`/api/demo/${id}/reschedule/`, data);
        return response.data;
    },

    // Get reschedule details
    getRescheduleDetails: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/reschedule/`);
        return response.data;
    },

    // Get demo status
    getDemoStatus: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/demo/${id}/status/`);
        return response.data;
    }
};
