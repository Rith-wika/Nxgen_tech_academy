import axiosInstance from "@/api/axiosInstance";

export const paymentService = {
  createOrder: async (data: { student_id: number; course_id: number; amount: number }) => {
    const res = await axiosInstance.post("/api/enrollments/create-order/", data);
    return res.data;
  },
  verifyPayment: async (data: { 
    razorpay_payment_id: string; 
    razorpay_order_id: string; 
    razorpay_signature: string;
    enrollment_id: number;
    amount: number;
  }) => {
    const res = await axiosInstance.post("/api/enrollments/verify-payment/", data);
    return res.data;
  },
};
