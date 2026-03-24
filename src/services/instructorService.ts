import axiosInstance from "@/api/axiosInstance";

export interface InstructorData {
    id?: string;
    name: string;
    email: string;
    phone: string;
    employee_id: string;
    date_of_joining: string;
    assigned_courses: number[]; // Array of course IDs
    qualification: string;
    experience: string;
    bank_account_number: string;
    ifsc_code: string;
    pan_number: string;
    aadhaar_number: string;
    documents?: File; // For upload
    is_active: boolean;
}

const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    };
};

export const instructorService = {
    // Admin: Add instructor
    createInstructor: async (data: any) => {
        try {
            // Use FormData for file uploads
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'assigned_courses' && Array.isArray(data[key])) {
                    data[key].forEach((id: number) => formData.append('assigned_courses', id.toString()));
                } else if (key === 'documents' && data[key]) {
                    formData.append('documents', data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            const res = await axiosInstance.post('/api/instructors/register/', formData, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error creating instructor", error);
            throw error;
        }
    },

    // Admin: List instructors
    getAllInstructors: async () => {
        try {
            const res = await axiosInstance.get('/api/instructors/', {
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching instructors", error);
            throw error;
        }
    },

    // Instructor: Get profile
    getProfile: async () => {
        try {
            const res = await axiosInstance.get('/api/instructor/profile/', {
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching instructor profile", error);
            throw error;
        }
    },

    // Instructor: Update profile
    updateProfile: async (data: any) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'documents' && data[key] instanceof File) {
                    formData.append('documents', data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            });
            const res = await axiosInstance.patch('/api/instructor/profile/update/', formData, getHeaders());
            return res.data;
        } catch (error) {
            console.error("Error updating instructor profile", error);
            throw error;
        }
    },

    // Instructor: Change password
    changePassword: async (passwords: any) => {
        try {
            const res = await axiosInstance.post('/api/auth/change-password/', passwords, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error changing password", error);
            throw error;
        }
    },

    // Instructor: Get assigned courses
    getMyCourses: async () => {
        try {
            const res = await axiosInstance.get('/api/instructors/my-courses/', {
                headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching instructor courses", error);
            throw error;
        }
    }
};