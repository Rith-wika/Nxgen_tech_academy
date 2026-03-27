import React, { useEffect, useRef, useState } from "react";
import { Trash2, Edit2, Check, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { LinkInput } from "@/components/LinkInput";
import { Lesson } from "@/types/moduleTypes";
import { moduleService } from "@/services/moduleService";
import { toast } from "sonner";

interface LessonBuilderProps {
  moduleId: string | number;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
  initialExpandedLessonId?: string | number | null;
  initialEditingLessonId?: string | number | null;
  initialAddMode?: boolean;
}

const isTemporaryId = (id: unknown) => typeof id === "string" && id.startsWith("temp-");

export const LessonBuilder: React.FC<LessonBuilderProps> = ({
  moduleId,
  lessons,
  onLessonsChange,
  isLoading = false,
  isReadOnly = false,
  initialExpandedLessonId = null,
  initialEditingLessonId = null,
  initialAddMode = false,
}) => {
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | number | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | number | null>(null);
  const [savingLessonId, setSavingLessonId] = useState<string | number | "new" | null>(null);

  const [newLesson, setNewLesson] = useState<Lesson>({
    title: "",
    content: "",
    videoUrl: "",
    files: [],
    links: [],
  });

  const emptyAssignment = { title: "", description: "", dueDate: "" };
  const [newAssignment, setNewAssignment] = useState(emptyAssignment);
  const [showNewAssignment, setShowNewAssignment] = useState(false);

  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const hasAppliedInitialAddMode = useRef(false);
  const hasAppliedInitialEditMode = useRef(false);
  const hasAppliedInitialExpandMode = useRef(false);

  const saving = isLoading || savingLessonId !== null;

  useEffect(() => {
    if (isReadOnly) {
      return;
    }

    if (initialAddMode && !hasAppliedInitialAddMode.current) {
      hasAppliedInitialAddMode.current = true;
      setIsAddingLesson(true);
      setExpandedLessonId(null);
      setEditingLessonId(null);
      setDraftLesson(null);
      return;
    }

    if (
      initialEditingLessonId === null ||
      initialEditingLessonId === undefined ||
      hasAppliedInitialEditMode.current
    ) {
      return;
    }

    const targetLesson = lessons.find((lesson) => String(lesson.id) === String(initialEditingLessonId));
    if (!targetLesson) {
      return;
    }

    hasAppliedInitialEditMode.current = true;
    setIsAddingLesson(false);
    setEditingLessonId(targetLesson.id ?? null);
    setExpandedLessonId(targetLesson.id ?? null);
    setDraftLesson({
      ...targetLesson,
      files: [...targetLesson.files],
      links: [...targetLesson.links],
    });
  }, [initialAddMode, initialEditingLessonId, isReadOnly, lessons]);

  useEffect(() => {
    if (isReadOnly || initialEditingLessonId !== null || hasAppliedInitialExpandMode.current) {
      return;
    }

    if (initialExpandedLessonId === null || initialExpandedLessonId === undefined) {
      return;
    }

    const targetLesson = lessons.find((lesson) => String(lesson.id) === String(initialExpandedLessonId));
    if (!targetLesson) {
      return;
    }

    hasAppliedInitialExpandMode.current = true;
    setExpandedLessonId(targetLesson.id ?? null);
  }, [initialExpandedLessonId, initialEditingLessonId, isReadOnly, lessons]);

  const startEditing = (lesson: Lesson) => {
    setEditingLessonId(lesson.id ?? null);
    setDraftLesson({
      ...lesson,
      files: [...lesson.files],
      links: [...lesson.links],
    });
    setExpandedLessonId(lesson.id ?? null);
  };

  const cancelEditing = () => {
    setEditingLessonId(null);
    setDraftLesson(null);
  };

  const addLesson = async () => {
    if (!newLesson.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }

    try {
      setSavingLessonId("new");

      const createdLesson = await moduleService.createLesson({
        moduleId,
        title: newLesson.title,
        content: newLesson.content,
        videoUrl: newLesson.videoUrl,
        order: lessons.length,
        file: newLesson.files?.[0]?.file || null,
        resourceTitle: newLesson.links?.[0]?.title || "",
        resourceLink: newLesson.links?.[0]?.url || "",
        assignmentTitle: showNewAssignment ? newAssignment.title : "",
        assignmentDescription: showNewAssignment ? newAssignment.description : "",
        assignmentDueDate: showNewAssignment ? newAssignment.dueDate : undefined,
      });

      const lessonId = createdLesson.id;
      if (lessonId === undefined || lessonId === null) {
        throw new Error("Lesson ID was not returned by the API.");
      }

      onLessonsChange([...lessons, createdLesson]);
      setNewLesson({ title: "", content: "", videoUrl: "", files: [], links: [] });
      setNewAssignment(emptyAssignment);
      setShowNewAssignment(false);
      setIsAddingLesson(false);
      setExpandedLessonId(null);
      toast.success("Lesson created successfully");
    } catch (error) {
      toast.error("Failed to create lesson");
      console.error(error);
    } finally {
      setSavingLessonId(null);
    }
  };

  const saveLessonEdits = async () => {
    if (!draftLesson || editingLessonId === null) {
      return;
    }

    if (!draftLesson.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    if (isTemporaryId(editingLessonId)) {
      toast.error("This lesson was not synced with backend yet.");
      return;
    }

    try {
      setSavingLessonId(editingLessonId);

      const updatedBase = await moduleService.updateLesson(editingLessonId, {
        moduleId,
        title: draftLesson.title,
        content: draftLesson.content,
        videoUrl: draftLesson.videoUrl,
        order: draftLesson.order,
        file: draftLesson.files?.[0]?.file || null,
        resourceTitle: draftLesson.links?.[0]?.title || "",
        resourceLink: draftLesson.links?.[0]?.url || "",
        assignmentTitle: draftLesson.assignment?.title || "",
        assignmentDescription: draftLesson.assignment?.description || "",
        assignmentDueDate: draftLesson.assignment?.dueDate || undefined,
      });

      const updatedLessons = lessons.map((lesson) =>
        lesson.id === editingLessonId
          ? updatedBase
          : lesson
      );

      onLessonsChange(updatedLessons);
      cancelEditing();
      toast.success("Lesson updated successfully");
    } catch (error) {
      toast.error("Failed to update lesson");
      console.error(error);
    } finally {
      setSavingLessonId(null);
    }
  };

  const deleteLesson = async (lessonId: string | number) => {
    try {
      setSavingLessonId(lessonId);

      if (!isTemporaryId(lessonId)) {
        await moduleService.deleteLesson(moduleId, lessonId);
      }

      onLessonsChange(lessons.filter((lesson) => lesson.id !== lessonId));
      if (expandedLessonId === lessonId) {
        setExpandedLessonId(null);
      }
      if (editingLessonId === lessonId) {
        cancelEditing();
      }
      toast.success("Lesson deleted");
    } catch (error) {
      toast.error("Failed to delete lesson");
      console.error(error);
    } finally {
      setSavingLessonId(null);
    }
  };

  const toggleExpand = (lessonId: string | number | undefined) => {
    if (lessonId === undefined) {
      return;
    }
    setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Lessons</h3>
        <span className="text-sm text-gray-500">{lessons.length} lessons</span>
      </div>

      {lessons.length === 0 ? (
        <Card className="bg-gray-50 border-dashed rounded-2xl">
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No lessons added yet</p>
            {!isReadOnly && (
              <p className="text-sm text-gray-400 mt-1">Click "Add Lesson" to create your first lesson</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isExpanded = expandedLessonId === lesson.id;
            const isEditing = editingLessonId === lesson.id && draftLesson !== null;
            const currentLesson = isEditing ? draftLesson : lesson;

            return (
              <div
                key={lesson.id ?? `${lesson.title}-${index}`}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    isExpanded ? "bg-blue-50 border-b border-gray-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExpand(lesson.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-500 min-w-max">{index + 1}.</span>
                    <h4 className="font-medium text-gray-800 truncate">{lesson.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 ml-4" onClick={(event) => event.stopPropagation()}>
                    {!isReadOnly && (
                      <>
                        {isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveLessonEdits}
                              disabled={saving}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditing}
                              disabled={saving}
                              className="text-gray-600 hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(lesson)}
                            disabled={saving}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => lesson.id !== undefined && deleteLesson(lesson.id)}
                          disabled={saving || lesson.id === undefined}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {savingLessonId === lesson.id ? (
                      <Loader2 className="w-4 h-4 text-[#000080] animate-spin" />
                    ) : isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white space-y-4 border-t border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Lesson Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentLesson.title}
                          onChange={(event) =>
                            setDraftLesson((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    title: event.target.value,
                                  }
                                : prev
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">{lesson.title}</div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Video URL</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentLesson.videoUrl || ""}
                          onChange={(e) => setDraftLesson((prev) => prev ? { ...prev, videoUrl: e.target.value } : prev)}
                          placeholder="e.g. https://youtube.com/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">
                          {lesson.videoUrl ? <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{lesson.videoUrl}</a> : "No video URL"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Content</label>
                      {isEditing ? (
                        <textarea
                          value={currentLesson.content}
                          onChange={(event) =>
                            setDraftLesson((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    content: event.target.value,
                                  }
                                : prev
                            )
                          }
                          placeholder="Enter lesson content..."
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] min-h-[140px] resize-none"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[90px]">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{lesson.content || "No content added"}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Files</label>
                      <FileUpload
                        files={currentLesson.files}
                        onFilesChange={(files) => {
                          if (isEditing) {
                            setDraftLesson((prev) => (prev ? { ...prev, files } : prev));
                          }
                        }}
                        isLoading={saving}
                        isReadOnly={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Resources</label>
                      <LinkInput
                        links={currentLesson.links}
                        onLinksChange={(links) => {
                          if (isEditing) {
                            setDraftLesson((prev) => (prev ? { ...prev, links } : prev));
                          }
                        }}
                        isLoading={saving}
                        isReadOnly={!isEditing}
                      />
                    </div>

                    {/* Assignment Section */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-base font-semibold text-gray-800">Assignment</label>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                            <input
                              type="text"
                              value={currentLesson.assignment?.title || ""}
                              onChange={(e) => setDraftLesson((prev) => prev ? { ...prev, assignment: { ...(prev.assignment || emptyAssignment), title: e.target.value } } : prev)}
                              placeholder="Assignment Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                            <textarea
                              value={currentLesson.assignment?.description || ""}
                              onChange={(e) => setDraftLesson((prev) => prev ? { ...prev, assignment: { ...(prev.assignment || emptyAssignment), description: e.target.value } } : prev)}
                              placeholder="Instructions..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] min-h-[80px] resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">Due Date (Optional)</label>
                              <input
                                type="datetime-local"
                                value={currentLesson.assignment?.dueDate ? new Date(new Date(currentLesson.assignment.dueDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                                onChange={(e) => setDraftLesson((prev) => prev ? { ...prev, assignment: { ...(prev.assignment || emptyAssignment), dueDate: e.target.value } } : prev)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        lesson.assignment ? (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h5 className="font-medium text-gray-800">{lesson.assignment.title}</h5>
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{lesson.assignment.description}</p>
                            <div className="flex gap-4 mt-3 text-sm text-gray-500">
                              <span>Due: {lesson.assignment.dueDate ? new Date(lesson.assignment.dueDate).toLocaleString() : "No due date"}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No assignment added.</p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isReadOnly && !isAddingLesson && (
        <Button
          className="w-full border-[#000080] text-[#000080] hover:bg-blue-50 rounded-xl"
          variant="outline"
          onClick={() => setIsAddingLesson(true)}
          disabled={saving}
        >
          Add Lesson
        </Button>
      )}

      {isAddingLesson && !isReadOnly && (
        <Card className="border-2 border-[#000080] bg-blue-50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Create New Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Lesson Title *</label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(event) => setNewLesson({ ...newLesson, title: event.target.value })}
                placeholder="Enter lesson title..."
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Video URL</label>
                <input
                  type="text"
                  value={newLesson.videoUrl || ""}
                  onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                  placeholder="e.g. https://youtube.com/..."
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Content</label>
              <textarea
                value={newLesson.content}
                onChange={(event) => setNewLesson({ ...newLesson, content: event.target.value })}
                placeholder="Enter lesson content..."
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] min-h-[120px] resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Upload Files</label>
              <FileUpload
                files={newLesson.files}
                onFilesChange={(files) => setNewLesson({ ...newLesson, files })}
                isLoading={saving}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Resources</label>
              <LinkInput
                links={newLesson.links}
                onLinksChange={(links) => setNewLesson({ ...newLesson, links })}
                isLoading={saving}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-semibold text-gray-800">Assignment</label>
                {!showNewAssignment ? (
                  <Button variant="outline" size="sm" onClick={() => setShowNewAssignment(true)} disabled={saving}>
                    + Add Assignment
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => { setShowNewAssignment(false); setNewAssignment(emptyAssignment); }} disabled={saving} className="text-red-500">
                    Remove Assignment
                  </Button>
                )}
              </div>

              {showNewAssignment && (
                <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      placeholder="Assignment Title"
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      placeholder="Instructions..."
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Due Date (Optional)</label>
                      <input
                        type="datetime-local"
                        value={newAssignment.dueDate ? new Date(new Date(newAssignment.dueDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                        disabled={saving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-[#000080] hover:bg-[#000060] rounded-xl" onClick={addLesson} disabled={saving}>
                {savingLessonId === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Lesson"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setIsAddingLesson(false);
                  setNewLesson({ title: "", content: "", videoUrl: "", files: [], links: [] });
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LessonBuilder;
