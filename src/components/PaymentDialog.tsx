import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enrollmentService, EnrollmentData, PaymentDetails } from "@/services/enrollmentService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  student: EnrollmentData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ student, isOpen, onClose, onSuccess }) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentPaid, setPaymentPaid] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);

  const fetchPaymentDetails = async () => {
    if (!student.id) return;
    try {
      setIsLoading(true);
      const data = await enrollmentService.getPaymentDetails(student.id);
      setPaymentDetails(data);
      setPaymentPaid(data.payment_paid?.toString() || "0");
      setHasPaymentDetails(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasPaymentDetails(false);
        setPaymentPaid("0");
        setPaymentDetails({
          course_name: String(student.course),
          fee_amount: student.fee_amount || 0,
          payment_paid: 0,
          remaining_balance: student.fee_amount || 0,
        });
      } else {
        console.error(error);
        toast.error("Failed to load payment details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && student.id) {
      fetchPaymentDetails();
    }
  }, [isOpen, student.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.id) return;
    
    try {
      setIsSubmitting(true);
      const payload = {
        payment_paid: parseFloat(paymentPaid) || 0,
        enrollment: student.id,
      };
      
      if (hasPaymentDetails) {
        await enrollmentService.updatePaymentDetails(student.id, payload);
      } else {
        await enrollmentService.createPaymentDetails(student.id, payload);
      }
      
      toast.success("Payment details saved successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save payment details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-slate-500">Loading payment info...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label>Course Name</Label>
              <Input value={paymentDetails?.course_name || student.course || ""} disabled className="bg-slate-100" />
            </div>
            
            <div className="grid gap-2">
              <Label>Fee Amount</Label>
              <Input value={paymentDetails?.fee_amount || 0} disabled className="bg-slate-100" />
            </div>

            <div className="grid gap-2">
              <Label>Payment Paid</Label>
              <Input 
                type="number" 
                value={paymentPaid} 
                onChange={(e) => setPaymentPaid(e.target.value)}
                placeholder="Enter amount paid"
                min="0"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Remaining Balance</Label>
              <Input 
                value={paymentDetails ? (paymentDetails.fee_amount || 0) - (parseFloat(paymentPaid) || 0) : 0} 
                disabled 
                className="bg-slate-100 font-semibold" 
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Payment
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;

