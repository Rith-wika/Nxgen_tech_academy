import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const ContactPreview = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Get <span className="gradient-text">Connected</span> With Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay in touch & grow your network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          {[
            { icon: Phone, title: "Call Us", info: "+91 63097 82855" },
            { icon: Mail, title: "Email Us", info: "nxgentechacademy@gmail.com" },
            { 
              icon: MapPin, 
              title: "Visit Us", 
              info: "Udaya Vensar Apartments, Rd Number 1, Hanuman Nagar, Kothaguda, Hyderabad, Telangana 500084",
              link: "https://maps.google.com/?q=Udaya+Vensar+Apartments,+Rd+Number+1,+Hanuman+Nagar,+Kothaguda,+Hyderabad,+Telangana+500084"
            },
          ].map((contact, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-md hover-lift text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <contact.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{contact.title}</h3>
              {contact.link ? (
                <a 
                  href={contact.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                >
                  {contact.info}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">{contact.info}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact-us">Contact Us Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
