import { LayoutDashboard, BookOpen, Users, User, FileText, Lock } from "lucide-react";

export const instructorSidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
    { label: "Courses", icon: BookOpen, path: "/instructor/courses" },
    { label: "Students", icon: Users, path: "/instructor/students" },
    { label: "Assignments", icon: FileText, path: "/instructor/assignments" },
    { label: "Profile", icon: User, path: "/instructor/profile" },
    { label: "Reset Password", icon: Lock, path: "/instructor/change-password" },
];
