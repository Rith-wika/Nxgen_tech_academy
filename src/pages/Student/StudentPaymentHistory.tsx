import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { studentSidebarItems } from "@/pages/Student/studentSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, History, AlertCircle, Loader2, IndianRupee } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

interface PaymentHistoryItem {
  enrollment_id: number;
  course_title: string;
  total_fee: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
}

const StudentPaymentHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/enrollments/student/courses/");
      
      const paymentData = res.data.map((course: any) => {
        const fee = Number(course.payment_detail?.fee_amount) || 0;
        const paid = Number(course.payment_detail?.payment_paid) || 0;
        let status = "Pending";
        if (fee > 0 && paid >= fee) status = "Paid";
        else if (paid > 0) status = "Partial";

        return {
          enrollment_id: course.id,
          course_title: course.course_title,
          total_fee: fee,
          amount_paid: paid,
          balance_due: Math.max(0, fee - paid),
          payment_status: status,
        };
      });

      setHistory(paymentData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="Payment History">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-sans">Payment History</h1>
            <p className="text-gray-500 font-medium">Track your previous transaction records and course balances.</p>
          </div>
          <Button onClick={() => navigate("/payments")} className="bg-[#000080] hover:bg-blue-800 text-white shadow-md">
            <IndianRupee className="w-4 h-4 mr-2" /> Make a Payment
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : history.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Payment History</h3>
            <p className="text-gray-500 mt-2">You haven't enrolled in any courses with payment data yet.</p>
          </Card>
        ) : (
          <Card className="shadow-lg border">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-[#000080]" /> Transactions & Fees Ledger
              </CardTitle>
              <CardDescription>Comprehensive ledger of course tuition fees and payments made to date.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="px-6 py-4">Enrollment Ref</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Total Tuition</th>
                      <th className="px-6 py-4">Tuition Paid</th>
                      <th className="px-6 py-4">Balance Remaining</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Payment Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {history.map((item) => (
                      <tr key={item.enrollment_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-xs text-gray-500">
                          ENR-{item.enrollment_id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {item.course_title}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          ₹{item.total_fee.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          ₹{item.amount_paid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-red-600">
                          ₹{item.balance_due.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={item.payment_status === "Paid" ? "default" : "secondary"}
                            className={item.payment_status === "Paid" ? "bg-green-100 text-green-800 border-none font-bold" : "bg-yellow-100 text-yellow-800 border-none font-bold"}
                          >
                            {item.payment_status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.balance_due > 0 ? (
                            <Button 
                              size="sm"
                              className="bg-[#000080] hover:bg-blue-800 text-white font-medium"
                              onClick={() => navigate("/payments")}
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Balance
                            </Button>
                          ) : (
                            <span className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                              ✓ Paid in Full
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentPaymentHistory;
