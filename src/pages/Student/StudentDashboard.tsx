import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studentSidebarItems } from "./studentSidebarItems";
import axiosInstance from "@/api/axiosInstance";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        enrolled_courses_count: 0,
        completed_lessons_count: 0,
        next_live_session: "Loading...",
        active_live_classes: [] as any[]
    });
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

    useEffect(() => {
        // Load dashboard summary stats and enrolled courses together on first render.
        const fetchDashboardData = async () => {
            try {
                const statsRes = await axiosInstance.get("/api/enrollments/student/dashboard-stats/");
                setStats(statsRes.data);

                const coursesRes = await axiosInstance.get("/api/enrollments/student/courses/");
                setEnrolledCourses(coursesRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="Student Portal">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {localStorage.getItem("username")}!</h1>

            {/* Live class alert banner shown only when one or more classes are currently active. */}
            {stats.active_live_classes && stats.active_live_classes.length > 0 && (
                <div className="mb-8 space-y-4">
                    {stats.active_live_classes.map((liveClass, idx) => (
                        <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm animate-pulse-slow">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                                <div>
                                    <h3 className="text-red-800 font-bold text-lg">Live Class Started: {liveClass.course_title}</h3>
                                    <p className="text-red-600 text-sm">Batch: {liveClass.batch_name} is currently live.</p>
                                </div>
                            </div>
                            <a
                                href={liveClass.live_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 sm:mt-0 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow transition-colors"
                            >
                                Join Class
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Top-level dashboard metrics cards. */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                <Card className="bg-gradient-to-r from-[#000080] to-blue-700 text-white border-none shadow-xl transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-white/80 text-sm uppercase">Enrolled Courses</CardTitle>
                        <div className="text-4xl font-bold">{stats.enrolled_courses_count < 10 ? `0${stats.enrolled_courses_count}` : stats.enrolled_courses_count}</div>
                    </CardHeader>
                </Card>
                <Card className="shadow-lg transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-gray-500 text-sm uppercase">Completed Lessons</CardTitle>
                        <div className="text-4xl font-bold">{stats.completed_lessons_count < 10 ? `0${stats.completed_lessons_count}` : stats.completed_lessons_count}</div>
                    </CardHeader>
                </Card>
                {/* <Card className="shadow-lg transform transition-transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-gray-500 text-sm uppercase">Next Live Session</CardTitle>
                        <div className="text-lg font-bold">{stats.next_live_session}</div>
                    </CardHeader>
                </Card>*/}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Show first two enrolled courses; fallback text when none are enrolled. */}
                {Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? enrolledCourses.slice(0, 2).map((course, idx) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-t-[#000080]">
                        <CardHeader>
                            <CardTitle>{course.course_title}</CardTitle>
                            <CardDescription>Instructor: {course.instructor_name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Course Progress ({course.completed_lessons}/{course.total_lessons} Lessons)</span>
                                    <span className="font-bold text-[#000080]">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                            </div>
                        </CardContent>
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <Link to={`/student/course/${course.course_id}`} className="flex items-center gap-2 text-[#000080] font-bold hover:underline">
                                <PlayCircle className="w-5 h-5" />
                                Continue Learning
                            </Link>
                        </div>
                    </Card>
                )) : (
                    <div className="text-gray-500 italic col-span-2">You haven't enrolled in any courses yet.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
