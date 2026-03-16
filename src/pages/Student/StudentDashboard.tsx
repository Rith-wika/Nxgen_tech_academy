import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Trophy, FileText, User, LogOut, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
        { label: "My Courses", icon: BookOpen, path: "/student/courses" },
        { label: "Progress", icon: PlayCircle, path: "/student/progress" },
        { label: "Certificates", icon: Trophy, path: "/student/certificates" },
        { label: "Profile", icon: User, path: "/student/profile" },
    ];

    const enrolledCourses = [
        { title: "SAP ABAP on HANA", instructor: "Dr. Smith", progress: 65 },
        { title: "SAP BTP Integration", instructor: "Jane Doe", progress: 40 },
    ];

    return (
        <DashboardLayout role="student" sidebarItems={sidebarItems} title="Student Portal">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {localStorage.getItem("username")}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-[#000080] to-blue-700 text-white border-none shadow-xl transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-white/80 text-sm uppercase">Enrolled Courses</CardTitle>
                        <div className="text-4xl font-bold">02</div>
                    </CardHeader>
                </Card>
                <Card className="shadow-lg transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-gray-500 text-sm uppercase">Completed Lessons</CardTitle>
                        <div className="text-4xl font-bold">18</div>
                    </CardHeader>
                </Card>
                <Card className="shadow-lg transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-gray-500 text-sm uppercase">Next Live Session</CardTitle>
                        <div className="text-lg font-bold">Sat, 20 Mar - 10:00 AM</div>
                    </CardHeader>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course, idx) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-t-[#000080]">
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>Instructor: {course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Course Progress</span>
                                    <span className="font-bold text-[#000080]">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                            </div>
                        </CardContent>
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <button className="flex items-center gap-2 text-[#000080] font-bold hover:underline">
                                <PlayCircle className="w-5 h-5" />
                                Continue Learning
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
