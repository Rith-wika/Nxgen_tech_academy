import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import axiosInstance from "@/api/axiosInstance";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/leads/contact-us/", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Contact Form Error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-700">
      <SEO
        title="Contact Us - NxGen Tech Academy"
        description="Get in touch with NxGen Tech Academy. Visit our offices in Hyderabad and Bangalore or send us a message."
        type="website"
        path="/contact"
      />

      <PageHero
        title="Contact Us"
        description="Empowering learners with real-world skills for a digital future"
      >
        <div className="text-sm opacity-90 font-medium flex gap-2 text-white">
          <Link to="/" className="hover:text-gray-200">Home</Link> / <span>Contact Us</span>
        </div>
      </PageHero>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Information (Left Column) */}
            <div className="space-y-10">
              <div>
                <p className="text-sm font-bold text-[#000080] uppercase tracking-wider mb-2">We Accelerate Customer Experiences</p>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">GET IN TOUCH</h2>
                <div className="w-16 h-1 bg-[#000080] mb-6"></div>
                <p className="text-gray-600 leading-relaxed">
                  Have questions about our courses or want to visit our center? We are here to help you. Reach out to us through any of the following channels.
                </p>
              </div>

              <div className="grid gap-8">
                {/* Hyderabad (Kothaguda) */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#000080]" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-2 text-gray-800">Hyderabad (Kothaguda)</p>
                    <a 
                      href="https://maps.google.com/?q=Udaya+Vensar+Apartments,+Rd+Number+1,+Hanuman+Nagar,+Kothaguda,+Hyderabad,+Telangana+500084" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 text-sm mb-2 block hover:text-[#000080] transition-colors"
                    >
                      Udaya Vensar Apartments, Rd Number 1, Hanuman Nagar, Kothaguda, Hyderabad, Telangana 500084
                    </a>
                    <p className="font-bold text-[#000080]">+91 9701314138</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#000080]" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-2 text-gray-800">Email Us</p>
                    <p className="text-gray-600 hover:text-[#000080]">nxgentechacademy@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Right Column) */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[150px] bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Focused on Hyderabad Kothaguda */}
      <section className="h-[400px] w-full">
        <iframe
          src="https://maps.google.com/maps?q=Udaya%20Vensar%20Apartments,%20Rd%20Number%201,%20Hanuman%20Nagar,%20Kothaguda,%20Hyderabad,%20Telangana%20500084&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="NxGen Tech Academy Location"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;