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
  const [newPayment, setNewPayment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPaymentDetails = async () => {
    if (!student.id) return;
    try {
      setIsLoading(true);
      const data = await enrollmentService.getPaymentDetails(student.id);
      setPaymentDetails(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPaymentDetails({
          course_name: String(student.course),
          fee_amount: student.fee_amount || 0,
          payment_paid: 0,
          remaining_balance: student.fee_amount || 0,
          transactions: [],
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
      setNewPayment("");
      fetchPaymentDetails();
    }
  }, [isOpen, student.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.id) return;

    const amount = parseFloat(newPayment);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    try {
      setIsSubmitting(true);
      // This always records a new payment on top of what's already been
      // paid - it does not overwrite the running total.
      await enrollmentService.createPaymentDetails(student.id, {
        payment_paid: amount,
        enrollment: student.id,
      });

      toast.success("Payment recorded successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to save payment details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const alreadyPaid = Number(paymentDetails?.payment_paid) || 0;
  const feeAmount = Number(paymentDetails?.fee_amount) || 0;
  const projectedDue = Math.max(0, feeAmount - alreadyPaid - (parseFloat(newPayment) || 0));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Total Fee</Label>
                <Input value={feeAmount} disabled className="bg-slate-100" />
              </div>
              <div className="grid gap-2">
                <Label>Due Amount</Label>
                <Input value={Math.max(0, feeAmount - alreadyPaid)} disabled className="bg-slate-100" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>New Payment Amount</Label>
              <Input
                type="number"
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                placeholder="Enter the amount being paid now"
                min="0"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Remaining Balance After This Payment</Label>
              <Input
                value={projectedDue}
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

