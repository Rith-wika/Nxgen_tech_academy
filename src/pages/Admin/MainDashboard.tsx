import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MainDashboard = () => {
    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Students", icon: Users, path: "/admin/students" },
        { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
        { label: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    const stats = [
        { title: "Total Students", value: "1,240", change: "+12%", icon: Users, color: "text-blue-600" },
        { title: "Total Instructors", value: "48", change: "+4%", icon: UserCheck, color: "text-green-600" },
        { title: "Total Courses", value: "32", change: "+8%", icon: LayoutDashboard, color: "text-purple-600" },
        { title: "Recent Activities", value: "156", change: "+24%", icon: Settings, color: "text-orange-600" },
    ];

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-green-500 font-semibold mt-1">
                                {stat.change} <span className="text-gray-400 font-normal">from last month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Student management content will appear here.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Course statistics will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default MainDashboard;
