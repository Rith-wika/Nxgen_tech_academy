import axiosInstance from "../api/axiosInstance";

export interface DashboardStats {
    total_campaigns: number;
    total_leads: number;
    total_demos: number;
    total_enrollments: number;
}

const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get('/api/dashboard/stats/');
        return response.data;
    }
};

export default dashboardService;
