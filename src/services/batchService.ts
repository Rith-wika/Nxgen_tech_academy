import axiosInstance from "../api/axiosInstance";

export interface Student {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
}

export interface Batch {
  id: number;
  name: string;
  description?: string;
  course: number | any;
  course_id: number;
  course_title: string;
  instructor?: number;
  students: Student[] | any[];
  live_link?: string;
  is_live_class_active?: boolean;
}

export const batchService = {
  // --- Admin Endpoints --- //
  getAllBatches: async () => {
    const response = await axiosInstance.get("/api/courses/batches/");
    return response.data;
  },
  
  createBatch: async (data: Partial<Batch>) => {
    const response = await axiosInstance.post("/api/courses/batches/", data);
    return response.data;
  },

  updateBatch: async (id: number, data: Partial<Batch>) => {
    const response = await axiosInstance.put(`/api/courses/batches/${id}/`, data);
    return response.data;
  },

  deleteBatch: async (id: number) => {
    const response = await axiosInstance.delete(`/api/courses/batches/${id}/`);
    return response.data;
  },

  manageStudents: async (batchId: number, studentEmails: string[], action: 'add' | 'remove') => {
    const response = await axiosInstance.post(`/api/courses/batches/${batchId}/manage_students/`, {
      student_emails: studentEmails,
      action: action,
    });
    return response.data;
  },

  // --- Instructor Endpoints --- //
  getInstructorBatches: async () => {
    const response = await axiosInstance.get("/api/courses/my-batches/");
    return response.data;
  },

  manageLiveClass: async (batchId: number, action: 'start' | 'end', liveLink?: string) => {
    const response = await axiosInstance.post(`/api/courses/batches/${batchId}/live_class/`, {
      action,
      live_link: liveLink
    });
    return response.data;
  }
};
