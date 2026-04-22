import { LayoutDashboard, BookOpen, FileText, User, PlayCircle, Lock } from "lucide-react";

export const studentSidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/student/courses" },
    { label: "Assignments", icon: FileText, path: "/student/assignments" },
    { label: "Progress", icon: PlayCircle, path: "/student/progress" },
    { label: "Profile", icon: User, path: "/student/profile" },
    { label: "Reset Password", icon: Lock, path: "/student/change-password" },
];
