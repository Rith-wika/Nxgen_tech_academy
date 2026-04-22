import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Upload, Users, User, FileText, Loader2, Lock } from "lucide-react";
import { instructorSidebarItems } from "./instructorSidebarItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { instructorService } from "@/services/instructorService";
import { batchService, Batch, Student } from "@/services/batchService";
import axiosInstance from "@/api/axiosInstance";

interface InstructorCourse {
    id: number;
    title: string;
    description?: string;
}

interface AssignmentEntry {
    submissions_count: number;
}

const InstructorDashboard = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<InstructorCourse[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [assignments, setAssignments] = useState<AssignmentEntry[]>([]);

    const sidebarItems = instructorSidebarItems;

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [coursesRes, batchesRes, assignmentsRes] = await Promise.all([
                    instructorService.getMyCourses(),
                    batchService.getInstructorBatches(),
                    axiosInstance.get("/api/courses/instructor-assignments/"),
                ]);

                setCourses(Array.isArray(coursesRes) ? coursesRes : []);
                setBatches(Array.isArray(batchesRes) ? batchesRes : []);
                setAssignments(Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []);
            } catch (error) {
                console.error("Failed to load instructor dashboard data:", error);
                setCourses([]);
                setBatches([]);
                setAssignments([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalStudents = useMemo(() => {
        const uniqueStudentIds = new Set<string | number>();
        batches.forEach((batch) => {
            (Array.isArray(batch.students) ? (batch.students as Student[]) : []).forEach((student) => {
                if (student?.id !== undefined && student?.id !== null) {
                    uniqueStudentIds.add(student.id);
                }
            });
        });
        return uniqueStudentIds.size;
    }, [batches]);

    const totalSubmissions = useMemo(
        () => assignments.reduce((sum, item) => sum + (item.submissions_count || 0), 0),
        [assignments]
    );

    const stats = [
        { title: "Courses Teaching", value: String(courses.length), icon: BookOpen, color: "text-blue-600" },
        { title: "Total Students", value: String(totalStudents), icon: Users, color: "text-green-600" },
        { title: "Assignment Submissions", value: String(totalSubmissions), icon: Upload, color: "text-purple-600" },
    ];

    const studentsByCourse = useMemo(() => {
        const map = new Map<number, Set<string | number>>();
        batches.forEach((batch) => {
            if (!map.has(batch.course_id)) {
                map.set(batch.course_id, new Set());
            }
            const studentSet = map.get(batch.course_id)!;
            (Array.isArray(batch.students) ? (batch.students as Student[]) : []).forEach((student) => {
                if (student?.id !== undefined && student?.id !== null) {
                    studentSet.add(student.id);
                }
            });
        });
        return map;
    }, [batches]);

    const batchesByCourse = useMemo(() => {
        const map = new Map<number, number>();
        batches.forEach((batch) => {
            map.set(batch.course_id, (map.get(batch.course_id) || 0) + 1);
        });
        return map;
    }, [batches]);

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
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-[#000080]" />
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-sm text-gray-500 py-4">No courses assigned yet.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map((course) => {
                                    const enrolledCount = studentsByCourse.get(course.id)?.size || 0;
                                    const batchCount = batchesByCourse.get(course.id) || 0;

                                    return (
                                        <div key={course.id} className="border rounded-lg p-4 hover:border-[#000080] transition-colors cursor-pointer group">
                                            <h3 className="font-bold group-hover:text-[#000080] line-clamp-2">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {course.description || "Course content is available for this batch."}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {enrolledCount} Students | {batchCount} Batches
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="text-xs bg-[#000080] text-white px-2 py-1 rounded hover:bg-[#000060]"
                                                    onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                                                >
                                                    Manage Content
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs"
                                                    onClick={() => navigate("/instructor/students")}
                                                >
                                                    View Students
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default InstructorDashboard;
