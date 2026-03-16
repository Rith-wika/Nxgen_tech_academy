import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Upload, Users, User, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InstructorDashboard = () => {
    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
        { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
        { label: "Upload Lessons", icon: Upload, path: "/instructor/upload-lesson" },
        { label: "Students", icon: Users, path: "/instructor/students" },
        { label: "Profile", icon: User, path: "/instructor/profile" },
    ];

    const stats = [
        { title: "Courses Teaching", value: "4", icon: BookOpen, color: "text-blue-600" },
        { title: "Total Students", value: "245", icon: Users, color: "text-green-600" },
        { title: "Recent Lessons", value: "12", icon: Upload, color: "text-purple-600" },
    ];

    return (
        <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Instructor Panel">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructor Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow border-l-4 border-l-[#000080]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#000080]" />
                            My Active Courses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border rounded-lg p-4 hover:border-[#000080] transition-colors cursor-pointer group">
                                    <h3 className="font-bold group-hover:text-[#000080]">SAP BTP Cloud Development</h3>
                                    <p className="text-sm text-gray-500 mt-1">85 Students Enrolled</p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="text-xs bg-[#000080] text-white px-2 py-1 rounded">View</button>
                                        <button className="text-xs border px-2 py-1 rounded">Lessons</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default InstructorDashboard;
