import {
    LayoutDashboard,
    Users,
    BookOpen,
    UsersRound,
    UserCheck,
    FileText,
    Target
} from "lucide-react";

export const adminSidebarItems = [
    { label: "Presales", icon: Target, path: "/admin/Presales" },
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { label: "Batches", icon: UsersRound, path: "/admin/batches" },
    { label: "Assignments", icon: FileText, path: "/admin/assignments" },
];
