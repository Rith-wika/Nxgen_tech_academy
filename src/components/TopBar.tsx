import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const TopBar = () => {
    return (
        <div className="bg-[#000080] text-white font-sans">
            <div className="container mx-auto px-4">
                {/* Top Row: Socials, Marquee, Logins */}
                <div className="flex flex-row justify-between items-center py-2 gap-2 sm:gap-4 border-b border-white/10">

                    {/* Social Icons */}
                    <div className="flex items-center gap-1.5 sm:gap-3 xl:gap-2">
                        <a href="https://www.facebook.com/NxGenTechAcademy/" target="_blank" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-white/30 rounded hover:bg-white/10 transition-colors"><Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                        <a href="https://www.youtube.com/@NxGenTechAcademy" target="_blank" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-white/30 rounded hover:bg-white/10 transition-colors"><Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                        <a href="https://www.instagram.com/nxgentechacademy/" target="_blank" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-white/30 rounded hover:bg-white/10 transition-colors"><Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                        <a href="https://www.linkedin.com/company/nxgen-tech-academy/" target="_blank" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-white/30 rounded hover:bg-white/10 transition-colors"><Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                        <a href="https://x.com/tech_nxgen" target="_blank" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-white/30 rounded hover:bg-white/10 transition-colors"><Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></a>
                    </div>


                    {/* Login Button */}
                    <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                        <Link to="/login" className="px-4 sm:px-6 py-1.5 border border-white rounded font-medium text-xs sm:text-sm hover:bg-white hover:text-[#000080] transition-colors whitespace-nowrap">
                            Login
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Contact Info */}
                {/* <div className="flex flex-col md:flex-row justify-start items-center gap-2 xl:gap-4 py-2 md:py-3 text-sm md:text-base font-medium">
                    <div className="flex items-center gap-2 border border-white/30 px-3 py-1 rounded bg-white/5 whitespace-nowrap">
                        <span>Corporate: +91 9701314138</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-center">
                        <span>Hyderabad - +91 9701314138</span>
                        <span className="hidden md:inline">|</span>
                        <span>Online - +91 9701314138</span>
                    </div>
                </div> */}
            </div>
        </div>
    );
};