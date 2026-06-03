import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { studentSidebarItems } from "@/pages/Student/studentSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { invoiceService } from "@/services/invoiceService";
import { toast } from "sonner";

interface CourseInvoice {
  enrollment_id: number;
  course_title: string;
  total_fee: number;
  amount_paid: number;
  payment_status: string;
  invoice_number?: string;
}

const StudentInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<CourseInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/enrollments/student/courses/");

      const invoiceList = res.data.map((course: any) => {
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
          payment_status: status,
          invoice_number: course.payment_detail?.invoice_number || `INV-${course.id}-${new Date().getFullYear()}`,
        };
      });

      // Filter to only show enrollments that have at least some payment activity or exist
      setInvoices(invoiceList);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load invoices list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (enrollmentId: number) => {
    try {
      const loadingToastId = toast.loading("Generating PDF...");
      const response = await invoiceService.downloadInvoicePDF(enrollmentId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${enrollmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(loadingToastId);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF", error);
      toast.dismiss();
      toast.error("Failed to download PDF.");
    }
  };

  return (
    <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="My Invoices">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
          <p className="text-gray-500 font-medium">View and download your official tuition payment invoices.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : invoices.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Invoices Available</h3>
            <p className="text-gray-500 mt-2">Invoices will appear here once you make course fee payments.</p>
          </Card>
        ) : (
          <Card className="shadow-lg border">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800">Available Invoices</CardTitle>
              <CardDescription>Click View to view payment details or Download PDF to save a local copy.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="px-6 py-4">Invoice ID</th>
                      <th className="px-6 py-4">Course Name</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4">Paid Amount</th>
                      <th className="px-6 py-4">Payment Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {invoices.map((inv) => (
                      <tr key={inv.enrollment_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-xs text-gray-600">
                          {inv.invoice_number}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {inv.course_title}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ₹{inv.total_fee.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          ₹{inv.amount_paid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={inv.payment_status === "Paid" ? "default" : "secondary"}
                            className={inv.payment_status === "Paid" ? "bg-green-100 text-green-800 border-none font-bold" : "bg-yellow-100 text-yellow-800 border-none font-bold"}
                          >
                            {inv.payment_status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-[#000080] hover:bg-blue-50"
                              onClick={() => navigate(`/student/invoices/${inv.enrollment_id}`)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#000080] hover:bg-blue-800 text-white"
                              onClick={() => handleDownloadPDF(inv.enrollment_id)}
                            >
                              <Download className="w-3.5 h-3.5 mr-1" /> PDF
                            </Button>
                          </div>
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

export default StudentInvoices;
