import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { DetailedCourse } from "@/data/detailedCourses";

interface EnrolledCourse extends DetailedCourse {
    enrollment_progress?: number;
    is_enrolled?: boolean;
}

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!storedUser) {
            navigate("/student-login");
            return;
        }

        setUsername(storedUser);
        setRole(storedRole || "student");

        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                // Fetch enrolled courses
                const enrollmentsRes = await axiosInstance.get("/api/enrollments/my-enrollments/").catch(() => ({ data: [] }));
                const enrollments = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : enrollmentsRes.data.results || [];
                
                // Fetch all courses
                const coursesRes = await axiosInstance.get("/api/courses/").catch(() => ({ data: [] }));
                const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || [];
                
                // Enrich courses with enrollment data
                const enrichedCourses = allCourses.map((course: DetailedCourse) => {
                    const enrollment = enrollments.find((e: any) => e.course === course.id || e.course_id === course.id);
                    return {
                        ...course,
                        enrollment_progress: enrollment?.progress || 0,
                        is_enrolled: !!enrollment
                    };
                });
                
                // Filter to show only enrolled courses
                const enrolledCourses = enrichedCourses.filter((c: EnrolledCourse) => c.is_enrolled);
                setCourses(enrolledCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                // Fallback: try to fetch from basic courses endpoint
                try {
                    const response = await axiosInstance.get("/api/courses/");
                    setCourses(response.data);
                } catch (fallbackError) {
                    console.error("Fallback failed:", fallbackError);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <PageHero
                title={`Welcome back, ${username}!`}
                description={`Explore your ${role} dashboard and continue your learning journey.`}
            />

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-xl border border-blue-50">
                        <Loader2 className="w-12 h-12 text-[#000080] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading your authorized courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Card key={course.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-lg group bg-white">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/40 transition-colors duration-300 flex items-center justify-center">
                                        <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 transform" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-[#000080] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>

                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl font-bold text-[#000080] line-clamp-1 group-hover:text-secondary transition-colors">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm">{course.tagline}</CardDescription>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-6 border-b border-gray-50 pb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-secondary" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4 text-secondary" />
                                            <span>{course.lessons} Lessons</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            <span>Course Progress</span>
                                            <span className="text-[#000080]">{course.enrollment_progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#000080] to-secondary transition-all duration-1000" style={{ width: `${course.enrollment_progress || 0}%` }}></div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button asChild className="w-full bg-[#000080] hover:bg-secondary text-white gap-2 h-11 rounded-lg transition-all shadow-md hover:shadow-blue-200">
                                        <Link to={`/dashboard/course/${course.id}`}>
                                            Continue Learning <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-[#000080]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Enrolled</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">It looks like you haven't been assigned any courses yet. Once you enroll, they will appear here.</p>
                        <Button asChild className="bg-[#000080] hover:bg-secondary px-8 h-12 text-lg">
                            <Link to="/all-courses">Explore All Courses</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
