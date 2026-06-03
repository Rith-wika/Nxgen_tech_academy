import {
    LayoutDashboard,
    Users,
    BookOpen,
    UsersRound,
    UserCheck,
    FileText,
    Target,
    IndianRupee,
    Receipt,
    Briefcase,
    GraduationCap,
    ClipboardList
} from "lucide-react";

export const adminSidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Presales", icon: Target, path: "/admin/Presales" },
    {
        label: "User Management",
        icon: Users,
        children: [
            { label: "Students", path: "/admin/students", icon: UsersRound },
            { label: "Instructors", path: "/admin/instructors", icon: UserCheck },
        ]
    },
    {
        label: "Course Management",
        icon: GraduationCap,
        children: [
            { label: "Courses", path: "/admin/courses", icon: BookOpen },
            { label: "Batches", path: "/admin/batches", icon: UsersRound },
        ]
    },
    {
        label: "Assessments",
        icon: ClipboardList,
        children: [
            { label: "Assignments", path: "/admin/assignments", icon: FileText },
        ]
    },
    {
        label: "Finance",
        icon: IndianRupee,
        children: [
            { label: "Transactions", path: "/admin/finance/transactions", icon: Briefcase },
            { label: "Invoices", path: "/admin/finance/invoices", icon: Receipt },
        ]
    }
];
