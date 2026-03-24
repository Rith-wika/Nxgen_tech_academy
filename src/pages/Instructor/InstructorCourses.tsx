import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    LayoutDashboard,
    BookOpen,
    Upload,
    Users,
    User,
    Loader2,
    ExternalLink,
    Plus,
    Trash2,
    Edit,
    ChevronRight,
    PlayCircle,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { instructorService } from "@/services/instructorService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const InstructorCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstructorProfile();
    }, []);

    const fetchInstructorProfile = async () => {
        try {
            setLoading(true);
            const profile = await instructorService.getProfile();
            // Assuming profile.assigned_courses returns course objects
            // If it returns IDs, we'd need to fetch detail but for now let's assume it has details
            setCourses(profile.assigned_courses || []);
        } catch (error) {
            toast.error("Failed to fetch assigned courses.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
        { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
        { label: "Students", icon: Users, path: "/instructor/students" },
        { label: "Profile", icon: User, path: "/instructor/profile" },
    ];

    if (loading) {
        return (
            <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Loading...">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="My Assigned Courses">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-500">Manage lessons and topics for your assigned subjects</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <Card className="col-span-full py-12 text-center text-gray-500">
                        No courses currently assigned to you.
                    </Card>
                ) : (
                    courses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-all border-t-4 border-t-[#000080] group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className="bg-blue-50 text-[#000080] hover:bg-blue-100 border-none rounded px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                                        Active
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-[#000080] transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {course.title || course.name || course}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 h-10 mt-2">
                                    {course.description || "Manage course content, lessons and student engagement."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 border-b pb-4">
                                        <div className="flex items-center gap-2">
                                            <PlayCircle className="w-4 h-4 text-[#000080]" />
                                            <span>Lessons: {course.lesson_count || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#000080]" />
                                            <span>Topics: {course.topic_count || 0}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-[#000080] hover:bg-[#000060] transition-colors gap-2"
                                        onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                                    >
                                        Manage Content
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full border-blue-100 hover:bg-blue-50 text-gray-600 transition-colors"
                                        onClick={() => window.open(`/courses/${course.id}`, '_blank')}
                                    >
                                        Preview Course <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
};

export default InstructorCourses;
