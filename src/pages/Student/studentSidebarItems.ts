import { LayoutDashboard, BookOpen, FileText, User, PlayCircle, Lock, CreditCard, IndianRupee, History, FileSpreadsheet } from "lucide-react";

export const studentSidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/student/courses" },
    { label: "Assignments", icon: FileText, path: "/student/assignments" },
    { label: "Progress", icon: PlayCircle, path: "/student/progress" },
    {
        label: "Payments",
        icon: CreditCard,
        children: [
            { label: "Make Payment", path: "/payments", icon: IndianRupee },
            { label: "Payment History", path: "/student/payment-history", icon: History },
            { label: "Invoices", path: "/student/invoices", icon: FileSpreadsheet },
        ]
    },
    { label: "Profile", icon: User, path: "/student/profile" },
    { label: "Reset Password", icon: Lock, path: "/student/change-password" },
];
