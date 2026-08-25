import { Link } from "react-router-dom";
import { Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 relative overflow-hidden font-sans">
      {/* World Map Background Texture */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'invert(1)'
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

          {/* Col 1: Contact */}
          <div>
            <h3 className="text-white text-xl mb-6 font-semibold">Contact</h3>
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#000080] mt-1 shrink-0" />
                <a
                  href="https://maps.google.com/?q=Udaya+Vensar+Apartments,+Rd+Number+1,+Hanuman+Nagar,+Kothaguda,+Hyderabad,+Telangana+500084"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Udaya Vensar Apartments, Rd Number 1, Hanuman Nagar, Kothaguda, Hyderabad, Telangana 500084
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#000080] shrink-0" />
                <span>+91 97013 14138</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Menu */}
          <div>
            <h3 className="text-white text-xl mb-6 font-semibold">Quick Menu</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Blogs
                </Link>
              </li>
              <li>
                <Link to="/bsnl-skill-development-partner" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Our Associations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Our Services */}
          <div>
            <h3 className="text-white text-xl mb-6 font-semibold">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/training-programs?category=SAP Courses" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> SAP Courses
                </Link>
              </li>
              <li>
                <Link to="/training-programs?category=Python" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Python
                </Link>
              </li>
              <li>
                <Link to="/training-programs?category=AI" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> AI
                </Link>
              </li>
              <li>
                <Link to="/training-programs?category=AIML" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> AIML
                </Link>
              </li>
              <li>
                <Link to="/training-programs?category=Data Analytics" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Data Analytics
                </Link>
              </li>
              <li>
                <Link to="/training-programs?category=Digital Marketing" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#000080] rounded-full"></span> Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h3 className="text-white text-xl mb-6 font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://x.com/tech_nxgen" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#000080] transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/NxGenTechAcademy/" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#000080] transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@NxGenTechAcademy" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#000080] transition-colors text-white">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/nxgentechacademy/" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#000080] transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/nxgen-tech-academy/" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#000080] transition-colors text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Highlighted Footer Section */}
        <div className="mt-12 bg-gradient-to-r from-[#000080]/20 via-[#000080]/40 to-[#000080]/20 border border-[#000080]/50 rounded-2xl py-8 px-6 text-center transform hover:scale-[1.01] transition-transform duration-300 shadow-lg">
          <h2 className="text-xl md:text-xl font-bold tracking-wide text-white mb-2">
            NxGenTech Academy
          </h2>
          <p className="text-[#22c55e] font-medium text-lg md:text-lg mb-3">
            Industry-Focused Learning & Career Development
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="hidden sm:inline-block w-8 h-[1px] bg-slate-500 shrink-0"></span>
            <p className="text-slate-300 text-sm md:text-lg text-center">
              Founded by <a href="https://www.sriainfotech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer relative z-20"><b>SRIA Infotech Pvt. Ltd.</b></a>
            </p>
            <span className="hidden sm:inline-block w-8 h-[1px] bg-slate-500 shrink-0"></span>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>&copy; NxGen Tech Academy. All Right Reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="#" className="hover:text-white">Cookies</Link>
            <Link to="#" className="hover:text-white">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
