import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Module } from "@/types/moduleTypes";
import { moduleService } from "@/services/moduleService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ModuleBuilderProps {
  courseId: string | number;
  courseTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  isReadOnly?: boolean;
  onModulesChange?: (modules: Module[]) => void;
}

export const ModuleBuilder: React.FC<ModuleBuilderProps> = ({
  courseId,
  courseTitle,
  isOpen,
  onClose,
  isReadOnly = false,
  onModulesChange,
}) => {
  const navigate = useNavigate();
  const goBackToCourses = () => {
    onClose();
    navigate("/instructor/courses", { replace: true });
    setTimeout(() => {
      if (window.location.pathname !== "/instructor/courses") {
        window.location.href = "/instructor/courses";
      }
    }, 0);
  };
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | number | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | number | null>(null);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [addScope, setAddScope] = useState<"current" | "both">("current");
  const [deleteModuleId, setDeleteModuleId] = useState<string | number | null>(null);
  const [moduleType, setModuleType] = useState<"training" | "industryReady">("training");

  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
  });

  const [draftModule, setDraftModule] = useState<{
    title: string;
    description: string;
    moduleType: "training" | "industryReady";
  }>({
    title: "",
    description: "",
    moduleType: "training",
  });

  const updateModulesState = (nextModules: Module[]) => {
    setModules(nextModules);
    onModulesChange?.(nextModules);
  };

  useEffect(() => {
    if (isOpen) {
      fetchModules();
    }
  }, [isOpen, courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      console.log("Fetching modules for courseId:", courseId);
      const moduleList = await moduleService.getModulesByCourse(courseId);

      const hydratedModules = await Promise.all(
        moduleList.map(async (moduleItem) => {
          if (moduleItem.lessons?.length) {
            return moduleItem;
          }

          if (!moduleItem.id) {
            return moduleItem;
          }

          const lessons = await moduleService.getLessonsByModule(moduleItem.id);
          return {
            ...moduleItem,
            lessons,
          };
        })
      );

      updateModulesState(hydratedModules);
      console.log("Modules fetched successfully:", hydratedModules);
    } catch (error: any) {
      console.error("Module fetch error:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
      toast.error("Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  };

  const startModuleEdit = (module: Module) => {
    setEditingModuleId(module.id ?? null);
    setDraftModule({
      title: module.title,
      description: module.description || "",
      moduleType: module.moduleType || "training",
    });
  };

  const saveModuleEdit = async (moduleId: string | number) => {
    if (!draftModule.title.trim()) {
      toast.error("Module title is required");
      return;
    }

    try {
      setIsSaving(true);
      const updatedModule = await moduleService.updateModule(courseId, moduleId, {
        title: draftModule.title,
        description: draftModule.description,
        moduleType: draftModule.moduleType,
      });

      const nextModules = modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              title: updatedModule.title,
              description: updatedModule.description,
              moduleType: updatedModule.moduleType,
            }
          : module
      );

      updateModulesState(nextModules);
      setEditingModuleId(null);
      toast.success("Module updated successfully");
    } catch (error) {
      toast.error("Failed to update module");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteModule = async (moduleId: string | number) => {
    try {
      setIsSaving(true);
      await moduleService.deleteModule(courseId, moduleId);

      const nextModules = modules.filter((module) => module.id !== moduleId);
      updateModulesState(nextModules);
      setDeleteModuleId(null);
      if (expandedModuleId === moduleId) {
        setExpandedModuleId(null);
      }
      toast.success("Module deleted");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpand = (moduleId: string | number | undefined) => {
    if (moduleId === undefined) {
      return;
    }
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
  };

  const modulesByType = {
    training: modules.filter((module) => (module.moduleType || "training") === "training"),
    industryReady: modules.filter((module) => (module.moduleType || "training") === "industryReady"),
  };

  const currentTrackLabel = moduleType === "training" ? "Training" : "Industry-Ready";
  const createButtonLabel = addScope === "both" ? "Add in Both Tracks" : `Add ${currentTrackLabel}`;

  const addModule = async (scope: "current" | "both" = "current") => {
    if (!newModule.title.trim()) {
      toast.error("Please enter a module title");
      return;
    }

    try {
      setIsSaving(true);

      if (scope === "both") {
        const [trainingModule, industryModule] = await Promise.all([
          moduleService.createModule({
            courseId,
            title: newModule.title,
            description: newModule.description,
            moduleType: "training",
            order: modulesByType.training.length,
          }),
          moduleService.createModule({
            courseId,
            title: newModule.title,
            description: newModule.description,
            moduleType: "industryReady",
            order: modulesByType.industryReady.length,
          }),
        ]);

        updateModulesState([
          ...modules,
          { ...trainingModule, lessons: trainingModule.lessons ?? [] },
          { ...industryModule, lessons: industryModule.lessons ?? [] },
        ]);
        setExpandedModuleId(trainingModule.id ?? null);
        toast.success("Module added to Training and Industry-Ready tracks");
      } else {
        const createdModule = await moduleService.createModule({
          courseId,
          title: newModule.title,
          description: newModule.description,
          moduleType,
          order: modulesByType[moduleType].length,
        });

        const moduleToAdd: Module = {
          ...createdModule,
          lessons: createdModule.lessons ?? [],
        };

        const nextModules = [...modules, moduleToAdd];
        updateModulesState(nextModules);
        setExpandedModuleId(moduleToAdd.id ?? null);
        toast.success("Module created successfully");
      }

      setNewModule({ title: "", description: "" });
      setIsAddingModule(false);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.detail || error?.message || "Failed to create module";
      toast.error(errorMsg);
      console.error("Module creation error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-10 space-y-6">
      <Card className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-white">
        <CardHeader className="px-6 py-0 border-b-0">
          <div className="rounded-2xl mt-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Learning Path Studio</CardTitle>
                {courseTitle ? <p className="text-sm text-blue-100 mt-1">Course: {courseTitle}</p> : null}
                <p className="text-xs text-blue-100/90 mt-2">Design, split, and manage modules across tracks with lesson-level control.</p>
              </div>
              <Button
                variant="secondary"
                type="button"
                onClick={goBackToCourses}
                disabled={isSaving}
                className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100"
              >
                Back to Courses
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 px-6 pb-8 bg-[radial-gradient(circle_at_top_right,#e2e8f0_0%,#f8fafc_45%,#ffffff_100%)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Total Modules</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{modules.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Active Track</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{moduleType === "training" ? "Training" : "Industry-Ready"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Track Count</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{modulesByType[moduleType].length}</p>
            </div>
          </div>

          {!isReadOnly && (
            <div className="inline-flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Button
                size="sm"
                onClick={() => setModuleType("training")}
                className={`h-10 px-5 rounded-xl transition-all ${
                  moduleType === "training"
                    ? "bg-[#000080] text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-slate-100"
                }`}
              >
                Training
              </Button>
              <Button
                size="sm"
                onClick={() => setModuleType("industryReady")}
                className={`h-10 px-5 rounded-xl transition-all ${
                  moduleType === "industryReady"
                    ? "bg-[#000080] text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-slate-100"
                }`}
              >
                Industry-Ready
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {moduleType === "training" ? "Training Modules" : "Industry-Ready Modules"}
                    </h3>
                    {moduleType && (
                      <p className="text-sm text-slate-500 mt-1">
                        Organize this track with modules, then add lessons inside each module.
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-slate-500">{modulesByType[moduleType].length} modules</span>
                </div>

                {modulesByType[moduleType].length === 0 ? (
                  <Card className="bg-gray-50 border-dashed rounded-2xl">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">No modules created for this track yet</p>
                      {!isReadOnly && (
                        <p className="text-sm text-gray-400 mt-1">Click "Add Module" to create a new module</p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {modulesByType[moduleType].map((moduleItem) => {
                      const isExpanded = expandedModuleId === moduleItem.id;
                      const isEditing = editingModuleId === moduleItem.id;

                      return (
                        <div
                          key={moduleItem.id}
                          className="border border-slate-200 rounded-2xl overflow-hidden hover:border-[#1d2a7a] transition-all bg-white shadow-sm"
                        >
                          <div
                            className={`flex items-start justify-between p-4 cursor-pointer transition-colors ${
                              isExpanded ? "bg-blue-50/70 border-b border-slate-200" : "hover:bg-slate-50"
                            }`}
                            onClick={() => toggleExpand(moduleItem.id)}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center mt-0.5">
                                {modulesByType[moduleType].findIndex((module) => module.id === moduleItem.id) + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="space-y-2" onClick={(event) => event.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={draftModule.title}
                                    onChange={(event) => setDraftModule((prev) => ({ ...prev, title: event.target.value }))}
                                    className="w-full px-3 py-2 border border-[#000080] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                                  />
                                  <textarea
                                    value={draftModule.description}
                                    onChange={(event) =>
                                      setDraftModule((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                      }))
                                    }
                                    placeholder="Enter module description..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm min-h-[70px] resize-none focus:outline-none focus:ring-2 focus:ring-[#000080]"
                                  />
                                  <select
                                    value={draftModule.moduleType}
                                    onChange={(event) =>
                                      setDraftModule((prev) => ({
                                        ...prev,
                                        moduleType: event.target.value as "training" | "industryReady",
                                      }))
                                    }
                                    className="w-full h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                                  >
                                    <option value="training">Training</option>
                                    <option value="industryReady">Industry-Ready</option>
                                  </select>
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-semibold text-slate-800 text-base">{moduleItem.title}</h4>
                                  {moduleItem.description ? (
                                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{moduleItem.description}</p>
                                  ) : null}
                                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                                    {(moduleItem.moduleType || "training") === "training" ? "Training" : "Industry-Ready"}
                                  </span>
                                </>
                              )}
                            </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4" onClick={(event) => event.stopPropagation()}>
                              {!isReadOnly && (
                                <>
                                  {isEditing ? (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moduleItem.id !== undefined && saveModuleEdit(moduleItem.id)}
                                        disabled={isSaving || moduleItem.id === undefined}
                                        className="text-green-600 hover:bg-green-50"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingModuleId(null)}
                                        disabled={isSaving}
                                        className="text-gray-600 hover:bg-gray-100"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => startModuleEdit(moduleItem)}
                                      disabled={isSaving}
                                      className="text-blue-600 hover:bg-blue-50"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteModuleId(moduleItem.id ?? null)}
                                    disabled={isSaving || moduleItem.id === undefined}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}

                              <span className="text-xs text-slate-600 px-2 py-1 bg-slate-100 rounded-full">
                                {moduleItem.lessons.length} lessons
                              </span>

                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {isExpanded && moduleItem.id !== undefined && (
                            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Lessons in this module</p>
                                {moduleItem.lessons.length > 0 ? (
                                  <ul className="mt-2 space-y-1">
                                    {moduleItem.lessons.slice(0, 3).map((lesson, index) => (
                                      <li key={lesson.id ?? `${moduleItem.id}-${index}`} className="text-sm text-slate-700">
                                        {index + 1}. {lesson.title}
                                      </li>
                                    ))}
                                    {moduleItem.lessons.length > 3 ? (
                                      <li className="text-xs text-slate-500">+{moduleItem.lessons.length - 3} more lessons</li>
                                    ) : null}
                                  </ul>
                                ) : (
                                  <p className="mt-2 text-sm text-slate-500">No lessons added yet.</p>
                                )}
                              </div>

                              <Button
                                className="w-full h-10 bg-[#000080] hover:bg-[#000060]"
                                onClick={() =>
                                  navigate(`/instructor/courses/${courseId}/modules/${moduleItem.id}/lessons`, {
                                    state: {
                                      moduleTitle: moduleItem.title,
                                      courseTitle,
                                      moduleType: moduleItem.moduleType || "training",
                                    },
                                  })
                                }
                              >
                                Open Lesson Builder
                                <ArrowUpRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {!isReadOnly && (
                <div className="pt-4 border-t border-slate-200">
                  {!isAddingModule ? (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-[#000080] hover:bg-[#000060] rounded-xl h-11 text-sm font-semibold"
                        onClick={() => {
                          setAddScope("current");
                          setIsAddingModule(true);
                        }}
                        disabled={isSaving}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add {currentTrackLabel}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl h-11 text-sm font-semibold border-slate-300"
                        onClick={() => {
                          setAddScope("both");
                          setIsAddingModule(true);
                          setNewModule({ title: "", description: "" });
                        }}
                        disabled={isSaving}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add in Both Tracks
                      </Button>
                    </div>
                  ) : (
                    <Card className="border border-[#1d2a7a] bg-white rounded-2xl shadow-md">
                      <CardContent className="pt-6 space-y-3">
                        <p className="text-sm text-slate-600">
                          {addScope === "both"
                            ? "This will create the same module in both Training and Industry-Ready tracks."
                            : `This module will be added to the ${currentTrackLabel} track.`}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Module Title</label>
                            <input
                              type="text"
                              value={newModule.title}
                              onChange={(event) =>
                                setNewModule((prev) => ({
                                  ...prev,
                                  title: event.target.value,
                                }))
                              }
                              placeholder="e.g. Introduction to Python"
                              disabled={isSaving}
                              className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Module Summary</label>
                            <textarea
                              value={newModule.description}
                              onChange={(event) =>
                                setNewModule((prev) => ({
                                  ...prev,
                                  description: event.target.value,
                                }))
                              }
                              placeholder="What should this module cover?"
                              disabled={isSaving}
                              className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] min-h-[92px] resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-[#000080] hover:bg-[#000060] rounded-xl h-11 text-sm font-semibold"
                            onClick={() => addModule(addScope)}
                            disabled={isSaving}
                          >
                            {createButtonLabel}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl h-11 text-sm font-semibold"
                            onClick={() => {
                              setIsAddingModule(false);
                              setAddScope("current");
                              setNewModule({ title: "", description: "" });
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteModuleId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteModuleId(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this module? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => deleteModuleId !== null && deleteModule(deleteModuleId)}
              disabled={isSaving}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModuleBuilder;
