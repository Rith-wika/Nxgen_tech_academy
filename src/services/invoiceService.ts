import axiosInstance from "@/api/axiosInstance";

const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
};

export const invoiceService = {
    // Admin: Get all paid invoices
    getAllInvoices: async () => {
        try {
            const res = await axiosInstance.get('/api/enrollments/invoices/paid/', getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching invoices", error);
            throw error;
        }
    },

    // Get invoice details (JSON format)
    getInvoiceDetails: async (enrollmentId: number | string) => {
        try {
            const res = await axiosInstance.get(`/api/enrollments/${enrollmentId}/invoice/`, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error fetching invoice details", error);
            throw error;
        }
    },

    // Get invoice PDF preview
    getInvoicePreview: async (enrollmentId: number | string) => {
        try {
            const res = await axiosInstance.get(`/api/enrollments/${enrollmentId}/invoice/?preview=true`, {
                ...getHeaders(),
                responseType: 'blob'
            });
            return window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        } catch (error) {
            console.error("Error fetching invoice preview", error);
            throw error;
        }
    },

    // Download invoice PDF
    downloadInvoicePDF: async (enrollmentId: number | string) => {
        try {
            const res = await axiosInstance.get(`/api/enrollments/${enrollmentId}/invoice/?export=pdf`, {
                ...getHeaders(),
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error("Error downloading invoice PDF", error);
            throw error;
        }
    }
};
