import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { moduleService } from "@/services/moduleService";
import { Module } from "@/types/moduleTypes";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  Layers,
  PencilLine,
  Plus,
  Edit2,
  Save,
  X,
  Trash2,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

type ModuleTrack = "training" | "industryReady";

const InstructorLessons = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModuleId, setExpandedModuleId] = useState<string | number | null>(null);
  const [loadedLessonsByModule, setLoadedLessonsByModule] = useState<Record<string, boolean>>({});
  const [editingModuleId, setEditingModuleId] = useState<string | number | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState("");
  const [moduleSaving, setModuleSaving] = useState(false);

  const sidebarItems = useMemo(
    () => [
      { label: "Dashboard",   icon: LayoutDashboard, path: "/instructor/dashboard" },
      { label: "Courses",     icon: BookOpen,        path: "/instructor/courses" },
      { label: "Students",    icon: Users,           path: "/instructor/students" },
      { label: "Assignments", icon: FileText,        path: "/instructor/assignments" },
      { label: "Profile",     icon: User,            path: "/instructor/profile" },
    ],
    []
  );

  useEffect(() => {
    const loadModules = async () => {
      if (!courseId) {
        toast.error("Missing course context");
        navigate("/instructor/courses", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const moduleList = await moduleService.getModulesByCourse(courseId);
        setModules(moduleList);
        setLoadedLessonsByModule(
          moduleList.reduce<Record<string, boolean>>((acc, moduleItem) => {
            acc[String(moduleItem.id)] = moduleItem.lessons.length > 0;
            return acc;
          }, {})
        );
      } catch (error) {
        toast.error("Failed to load course modules");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId, navigate]);

  const groupedModules = {
    training: modules.filter((moduleItem) => (moduleItem.moduleType || "training") === "training"),
    industryReady: modules.filter((moduleItem) => (moduleItem.moduleType || "training") === "industryReady"),
  };

  const toggleModule = async (moduleId: string | number | undefined) => {
    if (moduleId === undefined) {
      return;
    }

    const moduleKey = String(moduleId);
    const isOpening = String(expandedModuleId) !== moduleKey;

    if (isOpening && !loadedLessonsByModule[moduleKey]) {
      try {
        const lessons = await moduleService.getLessonsByModule(moduleId);
        setModules((prevModules) =>
          prevModules.map((moduleItem) =>
            String(moduleItem.id) === moduleKey
              ? {
                  ...moduleItem,
                  lessons,
                }
              : moduleItem
          )
        );
        setLoadedLessonsByModule((prev) => ({ ...prev, [moduleKey]: true }));
      } catch (error) {
        toast.error("Failed to load lessons for this module");
        console.error(error);
      }
    }

    setExpandedModuleId((current) => (String(current) === String(moduleId) ? null : moduleId));
  };

  const openLessonEditor = (moduleItem: Module, lessonId?: string | number, initialAddMode = false) => {
    navigate(`/instructor/courses/${courseId}/modules/${moduleItem.id}/lessons`, {
      state: {
        moduleTitle: moduleItem.title,
        moduleType: moduleItem.moduleType || "training",
        initialLessonId: lessonId,
        initialEditMode: Boolean(lessonId) && !initialAddMode,
        initialAddMode,
      },
    });
  };

  const goToModuleBuilder = (track: ModuleTrack) => {
    if (!courseId) {
      toast.error("Missing course context");
      return;
    }

    navigate("/instructor/courses", {
      state: {
        openModuleBuilderForCourseId: String(courseId),
        preferredModuleType: track,
      },
    });
  };

  const startEditModule = (moduleItem: Module) => {
    setEditingModuleId(moduleItem.id ?? null);
    setEditingModuleTitle(moduleItem.title || "");
  };

  const cancelEditModule = () => {
    setEditingModuleId(null);
    setEditingModuleTitle("");
  };

  const saveEditModule = async (moduleItem: Module) => {
    if (moduleItem.id === undefined || moduleItem.id === null) {
      toast.error("Cannot edit this module");
      return;
    }

    const title = editingModuleTitle.trim();
    if (!title) {
      toast.error("Module name is required");
      return;
    }

    try {
      setModuleSaving(true);
      const updated = await moduleService.updateModule(courseId!, moduleItem.id, { title });

      setModules((prev) =>
        prev.map((item) =>
          String(item.id) === String(moduleItem.id)
            ? {
                ...item,
                title: updated.title,
              }
            : item
        )
      );

      cancelEditModule();
      toast.success("Module updated");
    } catch (error) {
      toast.error("Failed to update module");
      console.error(error);
    } finally {
      setModuleSaving(false);
    }
  };

  const deleteModule = async (moduleItem: Module) => {
    if (moduleItem.id === undefined || moduleItem.id === null) {
      toast.error("Cannot delete this module");
      return;
    }

    const shouldDelete = window.confirm(`Delete module "${moduleItem.title}"?`);
    if (!shouldDelete) {
      return;
    }

    try {
      setModuleSaving(true);
      await moduleService.deleteModule(courseId!, moduleItem.id);
      setModules((prev) => prev.filter((item) => String(item.id) !== String(moduleItem.id)));
      setLoadedLessonsByModule((prev) => {
        const next = { ...prev };
        delete next[String(moduleItem.id)];
        return next;
      });
      if (String(expandedModuleId) === String(moduleItem.id)) {
        setExpandedModuleId(null);
      }
      toast.success("Module deleted");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error(error);
    } finally {
      setModuleSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Loading Content...">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Manage Content">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-8 space-y-6">
        <Card className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-white">
          <CardHeader className="px-6 py-0 border-b-0">
            <div className="rounded-2xl mt-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Course Content Hub</CardTitle>
                  <p className="text-sm text-blue-100 mt-1">Click a module to review its lessons and jump straight into editing.</p>
                </div>
                <Button
                  variant="secondary"
                  type="button"
                  className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => navigate("/instructor/courses", { replace: true })}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 px-6 pb-8 bg-[radial-gradient(circle_at_top_right,#e2e8f0_0%,#f8fafc_45%,#ffffff_100%)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {([
                { key: "training", title: "Training Modules", data: groupedModules.training },
                { key: "industryReady", title: "Industry-Ready Modules", data: groupedModules.industryReady },
              ] as const).map((section) => (
                <Card key={section.key} className="rounded-2xl border border-slate-200 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-800">{section.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{section.data.length}</Badge>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 bg-[#000080] hover:bg-[#000060]"
                          onClick={() => goToModuleBuilder(section.key)}
                          disabled={moduleSaving}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Module
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.data.length === 0 ? (
                      <p className="text-sm text-slate-500">No modules available.</p>
                    ) : (
                      section.data.map((moduleItem) => (
                        <div key={moduleItem.id} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                          <div className="w-full p-4 transition-colors hover:bg-slate-100/80">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                {String(editingModuleId) === String(moduleItem.id) ? (
                                  <input
                                    type="text"
                                    value={editingModuleTitle}
                                    onChange={(event) => setEditingModuleTitle(event.target.value)}
                                    disabled={moduleSaving}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#000080]"
                                    onClick={(event) => event.stopPropagation()}
                                  />
                                ) : (
                                  <p className="font-semibold text-slate-800 truncate">{moduleItem.title}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{moduleItem.description || "No module summary"}</p>
                                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5" />
                                  {moduleItem.lessons.length} lessons
                                </p>
                              </div>
                              <div className="shrink-0 flex items-center gap-1">
                                {String(editingModuleId) === String(moduleItem.id) ? (
                                  <>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2 text-green-700 hover:bg-green-50"
                                      onClick={() => saveEditModule(moduleItem)}
                                      disabled={moduleSaving}
                                    >
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2 text-slate-600 hover:bg-slate-100"
                                      onClick={cancelEditModule}
                                      disabled={moduleSaving}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2 text-blue-700 hover:bg-blue-50"
                                      onClick={() => startEditModule(moduleItem)}
                                      disabled={moduleSaving}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2 text-red-700 hover:bg-red-50"
                                      onClick={() => deleteModule(moduleItem)}
                                      disabled={moduleSaving}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}

                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-slate-500 hover:bg-slate-100"
                                  onClick={() => toggleModule(moduleItem.id)}
                                >
                                  {String(expandedModuleId) === String(moduleItem.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {String(expandedModuleId) === String(moduleItem.id) ? (
                            <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3">
                              {moduleItem.lessons.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                                  <p className="text-sm font-medium text-slate-700">No lessons added yet.</p>
                                  <p className="text-xs text-slate-500 mt-1">Create the first lesson for this module from the lesson editor.</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-3 border-[#000080] text-[#000080] hover:bg-blue-50"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openLessonEditor(moduleItem, undefined, true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {moduleItem.lessons.map((lessonItem, index) => (
                                    <div
                                      key={lessonItem.id ?? `${moduleItem.id}-${index}`}
                                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                          Lesson {index + 1}
                                        </p>
                                        <p className="truncate text-sm font-semibold text-slate-800 mt-1">
                                          {lessonItem.title || `Lesson ${index + 1}`}
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        className="h-9 bg-[#000080] hover:bg-[#000060]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openLessonEditor(moduleItem, lessonItem.id);
                                        }}
                                      >
                                        <PencilLine className="w-4 h-4 mr-2" />
                                        Edit
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {moduleItem.lessons.length > 0 ? (
                                <div className="flex justify-end pt-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="border-[#000080] text-[#000080] hover:bg-blue-50"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openLessonEditor(moduleItem, undefined, true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorLessons;
