import { FaWhatsapp } from "react-icons/fa";

// Global floating WhatsApp chat button.
// Rendered once in App.tsx so it appears on every page - before login,
// after login, and on every dashboard - instead of being duplicated
// per-page.
const WHATSAPP_NUMBER = "919059585039";
const WHATSAPP_MESSAGE = "Hi, I'm interested in courses at NxGen Tech Academy";

export const WhatsAppButton = () => {
  return (
    <a
      aria-label="Chat on WhatsApp"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noreferrer noopener"
      className="fixed right-6 bottom-6 z-50 flex items-center justify-center w-14 h-14"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-white shadow-lg animate-bounce transition-transform hover:scale-110">
        <FaWhatsapp className="w-8 h-8" />
      </span>
    </a>
  );
};

export default WhatsAppButton;
