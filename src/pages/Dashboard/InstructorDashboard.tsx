import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, ChevronRight, Loader2, PlusCircle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [studentCount, setStudentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [sessionCount, setSessionCount] = useState(0);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const role = localStorage.getItem("role");

        if (!storedUser || role !== "instructor") {
            navigate("/instructor-login");
            return;
        }

        setUsername(storedUser);
        fetchInstructorData();
    }, [navigate]);

    const fetchInstructorData = async () => {
        try {
            setIsLoading(true);
            const instructorId = localStorage.getItem("user_id");
            
            // Fetch instructor courses
            const coursesRes = await axiosInstance.get(`/api/instructors/${instructorId}/courses/`).catch(() => ({ data: [] }));
            const courseList = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || [];
            setCourses(courseList);
            setCourseCount(courseList.length);

            // Fetch students (from enrollments for this instructor's courses)
            const enrollmentsRes = await axiosInstance.get("/api/enrollments/").catch(() => ({ data: [] }));
            const enrollmentList = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : enrollmentsRes.data.results || [];
            
            // Filter enrollments for this instructor's courses
            const studentIds = new Set(
                enrollmentList
                    .filter((e: any) => courseList.some((c: any) => c.id === e.course))
                    .map((e: any) => e.student)
            );
            setStudentCount(studentIds.size);

            // Fetch sessions (assuming there's a sessions endpoint)
            const sessionsRes = await axiosInstance.get("/api/sessions/").catch(() => ({ data: [] }));
            const sessionList = Array.isArray(sessionsRes.data) ? sessionsRes.data : sessionsRes.data.results || [];
            
            // Filter upcoming sessions for this week
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);

            const upcomingSessions = sessionList.filter((s: any) => {
                const sessionDate = new Date(s.scheduled_time || s.date);
                return sessionDate >= weekStart && sessionDate <= weekEnd;
            });
            setSessionCount(upcomingSessions.length);
        } catch (error) {
            console.error("Failed to fetch instructor data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <PageHero
                title={`Instructor Portal: welcome, ${username}!`}
                description="Manage your courses, students, and schedules from one place."
            />

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <Card className="bg-white shadow-lg border-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                            <Users className="w-4 h-4 text-[#000080]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{isLoading ? "..." : studentCount}</div>
                            <p className="text-xs text-gray-400 mt-1">Students enrolled in your courses</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Active Courses</CardTitle>
                            <BookOpen className="w-4 h-4 text-[#000080]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{isLoading ? "..." : courseCount}</div>
                            <p className="text-xs text-gray-400 mt-1">Courses currently being taught</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Sessions</CardTitle>
                            <Calendar className="w-4 h-4 text-[#000080]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{isLoading ? "..." : sessionCount}</div>
                            <p className="text-xs text-gray-400 mt-1">Live classes scheduled for this week</p>
                        </CardContent>
                    </Card>
                </div>

                {isLoading ? (
                    <div className="mt-12 bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#000080] mr-4" />
                        <p className="text-gray-500">Loading your courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Link key={course.id} to={`/instructor/courses/${course.id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-[#000080]">{course.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>Modules: {course.modules?.length || 0}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-12">
                        <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <PlusCircle className="w-10 h-10 text-[#000080]" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Found</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't been assigned any courses yet. Contact your administrator to assign courses.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button className="bg-[#000080] hover:bg-secondary px-8 h-12 text-lg" onClick={() => navigate("/instructor/dashboard")}>
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboard;
