import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { studentSidebarItems } from "@/pages/Student/studentSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { paymentService } from "@/services/paymentService";
import { openRazorpayPopup } from "@/utils/razorpay";
import { toast } from "sonner";

interface CoursePayment {
  enrollment_id: number;
  course_id: number;
  course_title: string;
  fee_amount: number;
  payment_paid: number;
  payment_status: "Pending" | "Paid" | "Partial";
}

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<CoursePayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});

  const studentName = localStorage.getItem("username") || "Student";
  // Attempt to get user id, default to 1 if not found
  const studentId = parseInt(localStorage.getItem("user_id") || "1", 10);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      // Fetch enrolled courses. We assume the backend might return fee information, 
      // otherwise we add mock fee details for the UI.
      const res = await axiosInstance.get("/api/enrollments/student/courses/");
      
      const paymentData = res.data.map((course: any) => {
        const fee = Number(course.payment_detail?.fee_amount) || 0;
        const paid = Number(course.payment_detail?.payment_paid) || 0;
        let status = "Pending";
        if (fee > 0 && paid >= fee) status = "Paid";
        else if (paid > 0) status = "Partial";

        return {
          enrollment_id: course.id || course.payment_detail?.enrollment || 0,
          course_id: course.course_id,
          course_title: course.course_title,
          fee_amount: fee,
          payment_paid: paid,
          payment_status: status,
        };
      });

      setPayments(paymentData);
    } catch (error) {
      console.error("Failed to load payment info", error);
      toast.error("Failed to load payment details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async (course: CoursePayment) => {
    try {
      setProcessingId(course.course_id);
      
      // Calculate remaining balance
      const balance = course.fee_amount - course.payment_paid;
      
      // Use custom amount if entered, otherwise default to full remaining balance
      const inputVal = customAmounts[course.course_id];
      const amountToPay = inputVal ? parseFloat(inputVal) : balance;

      if (isNaN(amountToPay) || amountToPay <= 0) {
        toast.error("Please enter a valid payment amount.");
        return;
      }

      if (amountToPay > balance) {
        toast.error(`Payment amount cannot exceed the remaining balance of ₹${balance}.`);
        return;
      }

      // 1. Create order from backend (sending amount in Rupees)
      const orderData = await paymentService.createOrder({
        student_id: studentId,
        course_id: course.course_id,
        amount: amountToPay,
      });

      // 2. Open Razorpay Popup
      openRazorpayPopup({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "NxGen Tech Academy",
        description: `Payment for ${course.course_title}`,
        order_id: orderData.order_id,
        prefill: {
          name: studentName,
          email: localStorage.getItem("email") || "",
        },
        theme: {
          color: "#000080",
        },
        handler: async (response) => {
          try {
            // 3. Verify Payment
            await paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              enrollment_id: course.enrollment_id,
              amount: amountToPay,
            });

            toast.success("Payment successful!");
            // Redirect to the newly generated invoice page
            navigate(`/student/invoices/${course.enrollment_id}`);
          } catch (verifyError) {
            console.error("Verification failed", verifyError);
            toast.error("Payment verification failed. If amount was deducted, it will be refunded.");
          }
        },
      });
    } catch (error) {
      console.error("Payment initialization failed", error);
      toast.error("Could not initiate payment. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="Student Portal">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Payments</h1>
          <p className="text-gray-500">Manage your course fees and payment history.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Payment Records Found</h3>
            <p className="text-gray-500 mt-2">You haven't enrolled in any courses with pending payments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {payments.map((payment) => (
              <Card key={payment.course_id} className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-[#000080]">
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-[#000080]">{payment.course_title}</CardTitle>
                      <CardDescription className="mt-1">Student: {studentName}</CardDescription>
                    </div>
                    <Badge 
                      variant={payment.payment_status === "Paid" ? "default" : "destructive"}
                      className={`text-sm ${payment.payment_status === "Paid" ? "bg-green-500 hover:bg-green-600" : ""}`}
                    >
                      {payment.payment_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Fee</span>
                    <span className="font-semibold">₹{payment.fee_amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-semibold text-green-600">₹{payment.payment_paid}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Balance Due</span>
                    <span className={payment.fee_amount > payment.payment_paid ? "text-red-600" : "text-green-600"}>
                      ₹{Math.max(0, payment.fee_amount - payment.payment_paid)}
                    </span>
                  </div>
                  {payment.payment_status !== "Paid" && (
                    <div className="pt-4 border-t space-y-2">
                      <label htmlFor={`amount-input-${payment.course_id}`} className="text-xs font-semibold text-gray-500 block">
                        Amount to Pay (₹)
                      </label>
                      <Input
                        id={`amount-input-${payment.course_id}`}
                        type="number"
                        min="1"
                        max={payment.fee_amount - payment.payment_paid}
                        placeholder={`Enter amount (default: ₹${payment.fee_amount - payment.payment_paid})`}
                        value={customAmounts[payment.course_id] ?? ""}
                        onChange={(e) => {
                          setCustomAmounts({
                            ...customAmounts,
                            [payment.course_id]: e.target.value
                          });
                        }}
                        className="w-full border-gray-300 focus:border-[#000080]"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 border-t">
                  {payment.payment_status === "Paid" ? (
                    <div className="w-full flex items-center justify-center gap-2 text-green-600 font-semibold p-2">
                      <CheckCircle className="w-5 h-5" />
                      Payment Complete
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-[#000080] hover:bg-blue-800 text-white" 
                      onClick={() => handlePayNow(payment)}
                      disabled={processingId === payment.course_id}
                    >
                      {processingId === payment.course_id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payments;
