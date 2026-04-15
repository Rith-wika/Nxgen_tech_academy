import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    Settings, 
    GraduationCap, 
    TrendingUp, 
    Activity,
    UsersRound,
    UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

const MainDashboard = () => {
    const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [instructorCount, setInstructorCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const [enrollData, instructorRes, courseRes] = await Promise.all([
                    enrollmentService.getAllEnrollments(),
                    axiosInstance.get("/api/instructors/").catch(() => ({ data: [] })),
                    axiosInstance.get("/api/courses/courses/").catch(() => ({ data: [] }))
                ]);
                
                setEnrollments(Array.isArray(enrollData) ? enrollData : enrollData.results || []);
                
                const instructorList = instructorRes.data;
                const instructors = Array.isArray(instructorList) ? instructorList : instructorList.results || [];
                setInstructorCount(instructors.length);
                
                const courseList = courseRes.data;
                const courses = Array.isArray(courseList) ? courseList : courseList.results || [];
                setCourseCount(courses.length);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Students", icon: Users, path: "/admin/students" },
        { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
        { label: "Courses", icon: BookOpen, path: "/admin/courses" },
        { label: "Batches", icon: UsersRound, path: "/admin/batches" },
        // { label: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    const stats = [
        { title: "Student Enrollments", value: loading ? "..." : enrollments.length.toLocaleString(), change: "+100%", icon: Users, color: "text-blue-600" },
        { title: "Total Instructors", value: statsLoading ? "..." : instructorCount.toLocaleString(), change: "+4%", icon: Users, color: "text-green-600" },
        { title: "Total Courses", value: statsLoading ? "..." : courseCount.toLocaleString(), change: "+8%", icon: LayoutDashboard, color: "text-purple-600" },
        { title: "Active Enrollments", value: statsLoading ? "..." : enrollments.filter((e: any) => e.status === "approved").length.toLocaleString(), change: "+24%", icon: Settings, color: "text-orange-600" },
    ];

    const recentEnrollments = enrollments.slice(0, 5);

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
                                {stat.change} <span className="text-gray-400 font-normal">this month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : recentEnrollments.length > 0 ? (
                            <div className="space-y-4">
                                {recentEnrollments.map((e, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-semibold text-sm">{e.name}</p>
                                            <p className="text-xs text-gray-500">{e.course}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-blue-700">{e.course_type}</p>
                                            <p className="text-[10px] text-gray-400">{e.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recent enrollments found.</p>
                        )}
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
