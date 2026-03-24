import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Settings,
    LogOut,
    Menu,
    X,
    BookOpen,
    Upload,
    FileText,
    Trophy,
    User,
    ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarItem {
    label: string;
    icon: React.ElementType;
    path: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "admin" | "instructor" | "student" | "blog_admin";
    sidebarItems: SidebarItem[];
    title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, sidebarItems, title }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const isActive = (path: string) => {
        if (location.pathname === path) return true;
        // Specifically for instructor courses to stay active during drilling down
        if (path === "/instructor/courses" && (
            location.pathname.includes("/instructor/courses/") ||
            location.pathname.includes("/instructor/lessons/")
        )) return true;
        return false;
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col w-64 bg-[#000080] text-white transition-all duration-300 ease-in-out sticky top-0 h-screen overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold tracking-wider">{title}</h2>
                    <p className="text-xs text-white/60 mt-1 capitalize">{role.replace('_', ' ')} Portal</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                ? "bg-white text-[#000080] shadow-lg scale-105"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-[#000080]" : "text-white/60 group-hover:text-white"}`} />
                            <span className="font-medium">{item.label}</span>
                            {isActive(item.path) && <ChevronRight className="ml-auto w-4 h-4" />}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Overlay) */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-[#000080] text-white transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {/* Sidebar content (same as desktop) */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="text-xs text-white/60 capitalize">{role.replace('_', ' ')}</p>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.path) ? "bg-white text-[#000080]" : "text-white/80"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-10">
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-800">{localStorage.getItem("username")}</span>
                            <span className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#000080] text-white flex items-center justify-center font-bold">
                            {localStorage.getItem("username")?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
