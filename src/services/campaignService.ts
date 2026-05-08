import axiosInstance from '@/api/axiosInstance';

export interface Campaign {
    id?: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    status: string;
    leads?: number;
}

export const campaignService = {
    // Create Campaign
    createCampaign: async (data: Campaign) => {
        const response = await axiosInstance.post('/api/campaigns/create_campaign/', data);
        return response.data;
    },

    // Get All Campaigns
    getAllCampaigns: async () => {
        const response = await axiosInstance.get('/api/campaigns/create_campaign/');
        return response.data;
    },

    // Get Statuses
    getStatuses: async () => {
        const response = await axiosInstance.get('/api/campaigns/statuses/');
        return response.data;
    },

    // Get Single Campaign
    getCampaign: async (id: number | string) => {
        const response = await axiosInstance.get(`/api/campaigns/campaign/${id}/`);
        return response.data;
    },

    // Update Campaign (PUT)
    updateCampaign: async (id: number | string, data: Partial<Campaign>) => {
        const response = await axiosInstance.put(`/api/campaigns/campaign/${id}/`, data);
        return response.data;
    },

    // Delete Campaign
    deleteCampaign: async (id: number | string) => {
        const response = await axiosInstance.delete(`/api/campaigns/campaign/${id}/`);
        return response.data;
    }
};
