const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<void> | null = null;

/** Loads the Razorpay checkout SDK on demand instead of on every page load. */
const loadRazorpayScript = (): Promise<void> => {
  if (typeof window !== "undefined" && (window as any).Razorpay) {
    return Promise.resolve();
  }
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const openRazorpayPopup = async (
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
  try {
    await loadRazorpayScript();
  } catch {
    console.error("Razorpay SDK failed to load");
    return;
  }

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
