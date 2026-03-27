import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    User,
    Loader2,
    ExternalLink,
    Plus,
    ChevronRight,
    PlayCircle,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { instructorService } from "@/services/instructorService";
import { courseService } from "@/services/courseService";
import { moduleService } from "@/services/moduleService";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import ModuleBuilder from "../../components/ModuleBuilder";

const InstructorCourses = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>("");
    const hasOpenedFromRouteState = useRef(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (hasOpenedFromRouteState.current) {
            return;
        }

        const navState = location.state as { openModuleBuilderForCourseId?: string } | null;
        const targetCourseId = navState?.openModuleBuilderForCourseId;
        if (!targetCourseId || courses.length === 0) {
            return;
        }

        const matchedCourse = courses.find((course) => String(course.id) === String(targetCourseId));

        setSelectedCourseId(String(targetCourseId));
        setSelectedCourseTitle(matchedCourse?.title || matchedCourse?.name || "Course");
        hasOpenedFromRouteState.current = true;

        navigate(location.pathname, { replace: true, state: null });
    }, [courses, location.pathname, location.state, navigate]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            let courseList: any[] = [];

            try {
                const data = await instructorService.getMyCourses();
                courseList = Array.isArray(data) ? data : (data.results || []);
            } catch (error) {
                console.warn("Falling back to all courses for instructor view", error);
                const fallbackCourses = await courseService.getAllCourses();
                courseList = Array.isArray(fallbackCourses) ? fallbackCourses : [];
            }

            const enrichedCourses = await Promise.all(
                courseList.map(async (course) => {
                    try {
                        const modules = await moduleService.getModulesByCourse(course.id);
                        const lessonsPerModule = await Promise.all(
                            modules.map(async (moduleItem) => {
                                if (!moduleItem.id) return 0;
                                const moduleLessons = await moduleService.getLessonsByModule(moduleItem.id);
                                return moduleLessons.length;
                            })
                        );

                        const lessonCount = lessonsPerModule.reduce((sum, count) => sum + count, 0);
                        const topicCount = modules.length;

                        return {
                            ...course,
                            lesson_count: lessonCount > 0 ? lessonCount : (course.lesson_count || 0),
                            topic_count: topicCount > 0 ? topicCount : (course.topic_count || 0),
                        };
                    } catch {
                        return course;
                    }
                })
            );

            setCourses(enrichedCourses);
        } catch (error) {
            toast.error("Failed to fetch assigned courses.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { label: "Dashboard",   icon: LayoutDashboard, path: "/instructor/dashboard" },
        { label: "Courses",     icon: BookOpen,        path: "/instructor/courses" },
        { label: "Students",    icon: Users,           path: "/instructor/students" },
        { label: "Assignments", icon: FileText,        path: "/instructor/assignments" },
        { label: "Profile",     icon: User,            path: "/instructor/profile" },
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
            {selectedCourseId ? (
                <ModuleBuilder
                    courseId={selectedCourseId}
                    courseTitle={selectedCourseTitle}
                    isOpen={true}
                    onClose={() => {
                        setSelectedCourseId(null);
                        setSelectedCourseTitle("");
                        fetchCourses();
                    }}
                />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                            <p className="text-gray-500">Manage modules, lessons and resources for your assigned courses</p>
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
                                                    <span>Modules: {course.lesson_count || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#000080]" />
                                                    <span>Lessons: {course.topic_count || 0}</span>
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
                                                className="w-full bg-green-600 hover:bg-green-700 transition-colors gap-2"
                                                onClick={() => {
                                                    setSelectedCourseId(String(course.id));
                                                    setSelectedCourseTitle(course.title || course.name || "Course");
                                                }}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Course Modules
                                            </Button>

                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default InstructorCourses;
