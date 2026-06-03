import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/pages/Admin/adminSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Coins, Plus, Loader2, AlertCircle, CheckCircle2, History, XCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { enrollmentService } from "@/services/enrollmentService";
import { toast } from "sonner";

interface RefundItem {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: "Completed" | "Processing" | "Rejected";
  reason: string;
}

const Refunds = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([
    {
      id: "REF-109283",
      studentName: "Anil Kumar",
      courseTitle: "SAP ABAP on HANA",
      amount: 5000,
      date: "2026-05-24 14:22:10",
      status: "Completed",
      reason: "Accidental double payment"
    },
    {
      id: "REF-109284",
      studentName: "Karthik Raju",
      courseTitle: "Python Full Stack",
      amount: 12000,
      date: "2026-05-25 10:15:30",
      status: "Processing",
      reason: "Batch schedule mismatch"
    }
  ]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewRefundOpen, setIsNewRefundOpen] = useState(false);
  
  // Form fields
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      const list = Array.isArray(data) ? data : data.results || [];
      // Only keep students with some paid amount to allow refund options
      setEnrollments(list.filter((env: any) => (env.payment_paid || 0) > 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollmentId || !refundAmount || !refundReason) {
      toast.error("Please fill all required fields.");
      return;
    }

    const env = enrollments.find(x => x.id.toString() === selectedEnrollmentId);
    if (!env) return;

    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid refund amount.");
      return;
    }

    if (amt > env.payment_paid) {
      toast.error(`Refund amount cannot exceed the student's paid amount of ₹${env.payment_paid}.`);
      return;
    }

    try {
      setSubmitting(true);
      // Simulate backend API call or perform local state mutation
      // In production, we'd call: await axiosInstance.post(`/api/enrollments/${selectedEnrollmentId}/refund/`, { amount: amt, reason: refundReason });
      
      const newRefund: RefundItem = {
        id: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName: env.name,
        courseTitle: env.course || "Training",
        amount: amt,
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: "Completed",
        reason: refundReason
      };

      setRefunds([newRefund, ...refunds]);
      toast.success("Refund successfully recorded!");
      setIsNewRefundOpen(false);
      
      // Reset form
      setSelectedEnrollmentId("");
      setRefundAmount("");
      setRefundReason("");
    } catch (err) {
      toast.error("Failed to submit refund request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Refunds & Reversals</h1>
            <p className="text-gray-500">Record and track tuition refunds and payment reversals.</p>
          </div>

          <Dialog open={isNewRefundOpen} onOpenChange={setIsNewRefundOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#000080] hover:bg-blue-800 text-white shadow-md">
                <Plus className="w-4 h-4 mr-2" /> Record Refund
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record New Refund</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRecordRefund} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="student-select">Select Paid Student Enrollment</Label>
                  <select
                    id="student-select"
                    value={selectedEnrollmentId}
                    onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Enrollment --</option>
                    {enrollments.map((env) => (
                      <option key={env.id} value={env.id}>
                        {env.name} - {env.course} (Paid: ₹{env.payment_paid})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refund-amount">Refund Amount (₹)</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refund-reason">Reason for Refund</Label>
                  <Input
                    id="refund-reason"
                    placeholder="e.g. Schedule incompatibility"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsNewRefundOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Coins className="w-4 h-4 mr-2" />}
                    Issue Refund
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {refunds.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Refund Transactions</h3>
            <p className="text-gray-500 mt-2">All tuition fees and payments are currently settled in full.</p>
          </Card>
        ) : (
          <Card className="shadow-lg border">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-red-600" /> Refunds Audit History
              </CardTitle>
              <CardDescription>Records of all completed and processing fee refunds.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="px-6 py-4">Refund ID</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Amount Refunded</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {refunds.map((ref) => (
                      <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-xs text-slate-500">
                          {ref.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {ref.studentName}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {ref.courseTitle}
                        </td>
                        <td className="px-6 py-4 font-bold text-red-600">
                          ₹{ref.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                          {ref.reason}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                          {ref.date}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={ref.status === "Completed" ? "default" : "secondary"}
                            className={ref.status === "Completed" ? "bg-green-100 text-green-800 border-none font-bold" : "bg-yellow-100 text-yellow-800 border-none font-bold"}
                          >
                            {ref.status}
                          </Badge>
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

export default Refunds;
