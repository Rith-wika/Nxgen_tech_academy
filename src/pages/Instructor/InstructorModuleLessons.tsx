import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonBuilder } from "@/components/LessonBuilder";
import { Module, Lesson } from "@/types/moduleTypes";
import { moduleService } from "@/services/moduleService";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  ArrowLeft,
  Loader2,
  Layers,
  GraduationCap,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type LocationState = {
  moduleTitle?: string;
  courseTitle?: string;
  moduleType?: "training" | "industryReady";
  initialLessonId?: string | number;
  initialEditMode?: boolean;
  initialAddMode?: boolean;
};

const InstructorModuleLessons = () => {
  const navigate = useNavigate();
  const goBackToCourses = () => {
    navigate("/instructor/courses", { replace: true });
    setTimeout(() => {
      if (window.location.pathname !== "/instructor/courses") {
        window.location.href = "/instructor/courses";
      }
    }, 0);
  };
  const { state } = useLocation() as { state?: LocationState };
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();

  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = useMemo(
    () => [
      { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
      { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
      { label: "Students", icon: Users, path: "/instructor/students" },
      { label: "Profile", icon: User, path: "/instructor/profile" },
    ],
    []
  );

  useEffect(() => {
    const loadModuleLessons = async () => {
      if (!courseId || !moduleId) {
        toast.error("Missing module context.");
        navigate("/instructor/courses");
        return;
      }

      try {
        setLoading(true);
        const modules = await moduleService.getModulesByCourse(courseId);
        const selectedModule = modules.find((moduleItem) => String(moduleItem.id) === String(moduleId));

        const fetchedLessons = await moduleService.getLessonsByModule(moduleId);

        setModuleData(
          selectedModule || {
            id: moduleId,
            title: state?.moduleTitle || "Module",
            description: "",
            moduleType: state?.moduleType || "training",
            lessons: fetchedLessons,
          }
        );
        setLessons(fetchedLessons);
      } catch (error) {
        toast.error("Failed to load module lessons.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadModuleLessons();
  }, [courseId, moduleId, navigate, state?.moduleTitle, state?.moduleType]);

  if (loading) {
    return (
      <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Loading Lessons...">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Lesson Builder">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-8 space-y-6">
        <Card className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-white">
          <CardHeader className="px-6 py-0 border-b-0">
            <div className="rounded-2xl mt-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Lesson Builder</CardTitle>
                  <p className="text-sm text-blue-100 mt-1">Module: {moduleData?.title || state?.moduleTitle || "Module"}</p>
                  {state?.courseTitle ? <p className="text-xs text-blue-100/90 mt-1">Course: {state.courseTitle}</p> : null}
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100"
                  onClick={goBackToCourses}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 px-6 pb-8 bg-[radial-gradient(circle_at_top_right,#e2e8f0_0%,#f8fafc_45%,#ffffff_100%)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Total Lessons</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{lessons.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Track</p>
                <div className="mt-1">
                  <Badge className="bg-slate-100 text-slate-700 border-none">
                    {(moduleData?.moduleType || "training") === "training" ? "Training" : "Industry-Ready"}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Module Type</p>
                <p className="text-lg font-semibold text-slate-900 mt-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#000080]" />
                  Structured Learning
                </p>
              </div>
            </div>

            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                  <GraduationCap className="w-4 h-4 text-[#000080]" />
                  Build lessons with files, links, and notes under this module.
                </div>
                <LessonBuilder
                  moduleId={moduleData?.id || moduleId}
                  lessons={lessons}
                  onLessonsChange={setLessons}
                  isReadOnly={false}
                  initialExpandedLessonId={state?.initialLessonId ?? null}
                  initialEditingLessonId={state?.initialEditMode ? state.initialLessonId ?? null : null}
                  initialAddMode={state?.initialAddMode ?? false}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorModuleLessons;
