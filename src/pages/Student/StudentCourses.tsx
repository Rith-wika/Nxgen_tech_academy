import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayCircle } from "lucide-react";
import { studentSidebarItems } from "./studentSidebarItems";
import axiosInstance from "@/api/axiosInstance";
import { Link } from "react-router-dom";

const StudentCourses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axiosInstance.get("/api/enrollments/student/courses/");
                setEnrolledCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="My Courses">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Enrolled Courses</h1>
            
            {loading ? (
                <div className="flex justify-center py-12">
                    <span className="text-gray-500 animate-pulse">Loading courses...</span>
                </div>
            ) : !Array.isArray(enrolledCourses) || enrolledCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700">No Courses Yet</h3>
                    <p className="text-gray-500 mt-2">You haven't enrolled in any courses. Browse our catalog to get started!</p>
                    <Link to="/courses" className="mt-4 inline-block px-6 py-2 bg-[#000080] text-white rounded-md hover:bg-blue-800 transition-colors">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course, idx) => (
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
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentCourses;
