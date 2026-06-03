import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/pages/Admin/adminSidebarItems";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Download, ArrowLeft, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { invoiceService } from "@/services/invoiceService";

interface InvoiceData {
  invoice_number: string;
  date: string;
  student_details: {
    name: string;
    email: string;
    phone: string;
  };
  course_details: {
    title: string;
    type: string;
    mode: string;
  };
  payment_details: {
    total_fee: number;
    amount_paid: number;
    balance_remaining: number;
    payment_status: string;
    fee_status: string;
  };
  transaction_details: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  };
}

const AdminInvoiceDetail = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const [invoicePdfUrl, setInvoicePdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (enrollmentId) {
      fetchInvoice();
    }
  }, [enrollmentId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const url = await invoiceService.getInvoicePreview(enrollmentId as string);
      setInvoicePdfUrl(url);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load invoice details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const loadingToastId = toast.loading("Generating PDF...");
      const response = await invoiceService.downloadInvoicePDF(enrollmentId as string);
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

  const handlePrint = () => {
    const iframe = document.getElementById('invoice-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#000080]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoices
          </Button>

          {invoicePdfUrl && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handlePrint} variant="outline" className="flex-1 sm:flex-none border-gray-300">
                <Printer className="w-4 h-4 mr-2" /> Print Invoice
              </Button>
              <Button onClick={handleDownloadPDF} className="flex-1 sm:flex-none bg-[#000080] hover:bg-blue-800 text-white">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : !invoicePdfUrl ? (
          <Card className="p-8 text-center border-dashed">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Invoice Not Found</h3>
            <p className="text-gray-500 mt-2">Could not retrieve invoice details for enrollment ID: {enrollmentId}</p>
          </Card>
        ) : (
          <Card className="max-w-4xl mx-auto shadow-xl border overflow-hidden bg-white">
            <iframe
              id="invoice-iframe"
              src={invoicePdfUrl}
              title="Invoice Preview"
              style={{ width: '100%', height: '800px', border: 'none' }}
            />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminInvoiceDetail;
