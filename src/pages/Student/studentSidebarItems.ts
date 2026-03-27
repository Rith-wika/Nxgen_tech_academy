import { LayoutDashboard, BookOpen, Trophy, FileText, User, PlayCircle } from "lucide-react";

export const studentSidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/student/courses" },
    { label: "Progress", icon: PlayCircle, path: "/student/progress" },
    // { label: "Certificates", icon: Trophy, path: "/student/certificates" }, // Disabled as perfectly new and yet to be created per requirements
    { label: "Profile", icon: User, path: "/student/profile" },
];
