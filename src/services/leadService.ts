import axiosInstance from '@/api/axiosInstance';

export interface Lead {
    id?: number;
    fullname: string;
    email: string;
    phone_number: string;
    campaign: string | number;
    status: string;
    [key: string]: any;
}

export const leadService = {
    // Create Lead
    createLead: async (data: any) => {
        const response = await axiosInstance.post('/api/lead-management/create-lead/', data);
        return response.data;
    },

    // Get All Leads
    getAllLeads: async () => {
        const response = await axiosInstance.get('/api/lead-management/create-lead/');
        return response.data;
    },

    // Get Single Lead
    getLead: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/lead-management/lead/${id}/`);
        return response.data;
    },

    // Update Lead (PUT)
    updateLead: async (id: number | string, data: any) => {
        const response = await axiosInstance.put(`/api/lead-management/lead/${id}/`, data);
        return response.data;
    },

    // Delete Lead
    deleteLead: async (id: number | string) => {
        const response = await axiosInstance.delete(`/api/lead-management/lead/${id}/`);
        return response.data;
    },

    // Get Statuses
    getStatuses: async () => {
        const response = await axiosInstance.get('/api/lead-management/statuses/');
        return response.data;
    },

    // Patch Statuses
    patchStatuses: async (data: any) => {
        const response = await axiosInstance.patch('/api/lead-management/statuses/', data);
        return response.data;
    },

    // Bulk Import Post
    bulkImport: async (formData: FormData) => {
        const response = await axiosInstance.post('/api/lead-management/bulk-import/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
