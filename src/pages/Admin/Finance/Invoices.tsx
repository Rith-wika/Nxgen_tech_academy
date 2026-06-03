import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/pages/Admin/adminSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Search, Loader2, AlertCircle, FileSpreadsheet, RefreshCw } from "lucide-react";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import { invoiceService } from "@/services/invoiceService";
import { toast } from "sonner";

interface AdminInvoiceItem {
  id: number | string;
  name: string;
  email: string;
  course: string;
  invoice_number: string;
  fee_amount: number;
  payment_paid: number;
  fee_status: string;
}

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAllInvoices();
      const list = Array.isArray(data) ? data : data.results || [];

      const invoiceData = list.map((env: any) => {
        const isInvoiceFormat = !!env.student_details;

        return {
          id: env.id || env.enrollment_id || env.enrollment || env.invoice_number || Math.random().toString(),
          name: isInvoiceFormat ? env.student_details?.name : (env.student_name || env.name || ""),
          email: isInvoiceFormat ? env.student_details?.email : (env.student_email || env.email || ""),
          course: isInvoiceFormat ? env.course_details?.title : (env.course_title || env.course || env.course_details?.title || "General Training"),
          invoice_number: env.invoice_number || env.payment_detail?.invoice_number || `INV-${env.id || env.enrollment_id || 'GEN'}-${new Date().getFullYear()}`,
          fee_amount: isInvoiceFormat ? env.payment_details?.total_fee : (env.fee_amount || env.payment_details?.total_fee || ((Number(env.amount_paid) || 0) + (Number(env.balance_remaining) || 0))),
          payment_paid: isInvoiceFormat ? env.payment_details?.amount_paid : (env.amount_paid || env.payment_paid || env.payment_details?.amount_paid || 0),
          fee_status: isInvoiceFormat ? env.payment_details?.fee_status : (env.fee_status || env.payment_details?.fee_status || "Pending"),
        };
      });

      setInvoices(invoiceData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load invoice records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id: number | string) => {
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Generating PDF...");

      const response = await invoiceService.downloadInvoicePDF(id);

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${id}.pdf`);
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

  const filteredInvoices = invoices.filter((inv) => {
    const searchLow = searchTerm.toLowerCase();
    return (
      (inv.name || "").toLowerCase().includes(searchLow) ||
      (inv.email || "").toLowerCase().includes(searchLow) ||
      (inv.course || "").toLowerCase().includes(searchLow) ||
      (inv.invoice_number || "").toLowerCase().includes(searchLow)
    );
  });

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoices Directory</h1>
            <p className="text-gray-500">Search and view generated student invoices and payment bills.</p>
          </div>
          <Button onClick={fetchInvoices} variant="outline" size="sm" className="border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by student name, invoice number, course or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Invoices Found</h3>
            <p className="text-gray-500 mt-2">No invoice records match your search parameters.</p>
          </Card>
        ) : (
          <Card className="shadow-lg border">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#000080]" /> Student Invoices Ledger
              </CardTitle>
              <CardDescription>Generated tuition fee bills with transaction references.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="px-2 md:px-3 py-3">Invoice ID</th>
                      <th className="px-2 md:px-3 py-3">Student</th>
                      <th className="px-2 md:px-3 py-3">Course</th>
                      <th className="px-2 md:px-3 py-3">Total Amount</th>
                      <th className="px-2 md:px-3 py-3">Paid Amount</th>
                      <th className="px-2 md:px-3 py-3">Fee Status</th>
                      <th className="px-2 md:px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 md:px-3 py-3 font-mono font-semibold text-xs text-gray-600 break-all max-w-[140px]">
                          {inv.invoice_number}
                        </td>
                        <td className="px-2 md:px-3 py-3 min-w-[120px]">
                          <div className="font-semibold text-slate-800">{inv.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5 break-all max-w-[150px]">{inv.email}</div>
                        </td>
                        <td className="px-2 md:px-3 py-3 font-medium text-slate-800">
                          {inv.course}
                        </td>
                        <td className="px-2 md:px-3 py-3 font-semibold whitespace-nowrap">
                          ₹{inv.fee_amount.toLocaleString()}
                        </td>
                        <td className="px-2 md:px-3 py-3 font-semibold text-green-600 whitespace-nowrap">
                          ₹{inv.payment_paid.toLocaleString()}
                        </td>
                        <td className="px-2 md:px-3 py-3">
                          <Badge
                            variant={inv.fee_status.toLowerCase().includes("paid") && !inv.fee_status.toLowerCase().includes("partial") ? "default" : "secondary"}
                            className={inv.fee_status.toLowerCase().includes("paid") && !inv.fee_status.toLowerCase().includes("partial") ? "bg-green-100 text-green-800 border-none font-bold whitespace-nowrap" : "bg-yellow-100 text-yellow-800 border-none font-bold whitespace-nowrap"}
                          >
                            {inv.fee_status}
                          </Badge>
                        </td>
                        <td className="px-2 md:px-3 py-3 text-right">
                          <div className="flex flex-wrap xl:flex-nowrap justify-end gap-1.5 md:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-[#000080] px-2 md:px-3"
                              onClick={() => navigate(`/admin/finance/invoices/${inv.id}`)}
                            >
                              <Eye className="w-3.5 h-3.5 md:mr-1" /> <span className="hidden md:inline">View</span>
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#000080] hover:bg-blue-800 text-white px-2 md:px-3"
                              onClick={() => handleDownloadPDF(inv.id)}
                            >
                              <Download className="w-3.5 h-3.5 md:mr-1" /> <span className="hidden md:inline">PDF</span>
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

export default Invoices;
