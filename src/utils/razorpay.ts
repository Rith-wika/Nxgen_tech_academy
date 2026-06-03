export const openRazorpayPopup = (
  options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    handler: (response: any) => void;
  }
) => {
  if (typeof window === "undefined" || !(window as any).Razorpay) {
    console.error("Razorpay SDK not loaded");
    return;
  }

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", function (response: any) {
    console.error("Payment failed", response.error);
    // Optional: handle failure
  });
  rzp.open();
};
