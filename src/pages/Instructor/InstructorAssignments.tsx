import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  ListChecks,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import { moduleService } from "@/services/moduleService";
import { instructorService } from "@/services/instructorService";

type AssignmentStatus = "Draft" | "Active" | "Closed";

interface AssignmentItem {
  lessonId: number;
  moduleId: number;
  moduleTitle: string;
  courseId: number;
  courseTitle: string;
  lessonTitle: string;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDueDate: string | null;
  submissionsCount: number;
  status: AssignmentStatus;
}

interface SubmissionItem {
  submissionId: number | null;
  studentId: number;
  studentName: string;
  studentEmail: string;
  status: "Submitted" | "Not Submitted";
  submittedAt: string | null;
  textAnswer?: string;
  fileUrl?: string;
  score?: number | null;
  feedback?: string;
  gradedAt?: string | null;
  gradedBy?: string | null;
}

interface AssignmentApiItem {
  assignment: {
    assignment_title?: string;
    assignment_description?: string;
    assignment_due_date?: string | null;
  };
  course: {
    id: number;
    title: string;
  };
  module: {
    id: number;
    title: string;
  };
  lesson: {
    id: number;
    title: string;
  };
  submissions_count: number;
}

interface SubmissionApiItem {
  submission_id: number | null;
  student_id: number;
  student_name: string;
  student_email: string;
  status: "Submitted" | "Not Submitted";
  submitted_at: string | null;
  score?: number | null;
  feedback?: string;
  graded_at?: string | null;
  graded_by?: string | null;
  submission_data: {
    text_answer?: string;
    file_upload?: string;
  } | null;
}

type FormState = {
  courseId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
};

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/instructor/courses" },
  { label: "Students", icon: Users, path: "/instructor/students" },
  { label: "Assignments", icon: FileText, path: "/instructor/assignments" },
  { label: "Profile", icon: User, path: "/instructor/profile" },
];
const initialFormState: FormState = {
  courseId: "",
  moduleId: "",
  lessonId: "",
  title: "",
  description: "",
  dueDate: "",
};

const deriveStatus = (dueDate: string | null): AssignmentStatus => {
  if (!dueDate) {
    return "Draft";
  }
  return new Date(dueDate) < new Date() ? "Closed" : "Active";
};

const toDatetimeLocal = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

// ========================
// MAIN COMPONENT
// ========================

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);
  const [modules, setModules] = useState<Array<{ id: number; title: string }>>([]);
  const [lessons, setLessons] = useState<Array<{ id: number; title: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);

  // Selected State
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [gradeData, setGradeData] = useState({ score: "", feedback: "" });

  const fetchAssignments = async () => {
    try {
      const res = await axiosInstance.get("/api/courses/instructor-assignments/");
      const data: AssignmentApiItem[] = Array.isArray(res.data) ? res.data : [];
      const mapped = data.map((item) => ({
        lessonId: item.lesson.id,
        moduleId: item.module.id,
        moduleTitle: item.module.title,
        courseId: item.course.id,
        courseTitle: item.course.title,
        lessonTitle: item.lesson.title,
        assignmentTitle: item.assignment?.assignment_title || item.lesson.title,
        assignmentDescription: item.assignment?.assignment_description || "",
        assignmentDueDate: item.assignment?.assignment_due_date || null,
        submissionsCount: item.submissions_count || 0,
        status: deriveStatus(item.assignment?.assignment_due_date || null),
      }));
      setAssignments(mapped);
    } catch (error) {
      console.error("Failed to fetch assignments", error);
      toast.error("Failed to load assignments.");
    }
  };

  useEffect(() => {
    const boot = async () => {
      try {
        setInitialLoading(true);
        const [courseData] = await Promise.all([
          instructorService.getMyCourses(),
          fetchAssignments(),
        ]);
        setCourses(Array.isArray(courseData) ? courseData : []);
      } finally {
        setInitialLoading(false);
      }
    };

    boot();
  }, []);

  useEffect(() => {
    const loadModules = async () => {
      if (!formData.courseId) {
        setModules([]);
        return;
      }
      try {
        const data = await moduleService.getModulesByCourse(Number(formData.courseId));
        setModules(data.map((module) => ({ id: Number(module.id), title: module.title })));
      } catch {
        setModules([]);
      }
    };

    loadModules();
  }, [formData.courseId]);

  useEffect(() => {
    const loadLessons = async () => {
      if (!formData.moduleId) {
        setLessons([]);
        return;
      }
      try {
        const data = await moduleService.getLessonsByModule(Number(formData.moduleId));
        setLessons(data.map((lesson) => ({ id: Number(lesson.id), title: lesson.title })));
      } catch {
        setLessons([]);
      }
    };

    loadLessons();
  }, [formData.moduleId]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchCourse = filterCourse ? String(a.courseId) === filterCourse : true;
      const matchStatus = filterStatus ? a.status === filterStatus : true;
      const matchSearch = a.assignmentTitle.toLowerCase().includes(filterSearch.toLowerCase());
      return matchCourse && matchStatus && matchSearch;
    });
  }, [assignments, filterCourse, filterStatus, filterSearch]);

  // ========================
  // HANDLERS
  // ========================

  const handleOpenForm = (assignment?: AssignmentItem) => {
    if (assignment) {
      setFormData({
        title: assignment.assignmentTitle,
        description: assignment.assignmentDescription,
        courseId: String(assignment.courseId),
        moduleId: String(assignment.moduleId),
        lessonId: String(assignment.lessonId),
        dueDate: toDatetimeLocal(assignment.assignmentDueDate),
      });
      setSelectedAssignment(assignment);
    } else {
      setFormData(initialFormState);
      setSelectedAssignment(null);
    }
    setIsFormOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!formData.courseId || !formData.moduleId || !formData.lessonId || !formData.title || !formData.description || !formData.dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (new Date(formData.dueDate) < new Date()) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    setLoading(true);
    try {
      await moduleService.upsertLessonAssignment({
        moduleId: Number(formData.moduleId),
        lessonId: Number(formData.lessonId),
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
      });

      await fetchAssignments();
      toast.success(selectedAssignment ? "Assignment updated successfully!" : "Assignment created successfully!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save assignment", error);
      toast.error("Failed to save assignment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignment: AssignmentItem) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        setLoading(true);
        await moduleService.upsertLessonAssignment({
          moduleId: assignment.moduleId,
          lessonId: assignment.lessonId,
          title: "",
          description: "",
          dueDate: undefined,
        });
        await fetchAssignments();
        toast.success("Assignment deleted.");
      } catch (error) {
        console.error("Failed to delete assignment", error);
        toast.error("Failed to delete assignment.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseAssignment = async (assignment: AssignmentItem) => {
    if (window.confirm("Close this assignment? Students will no longer submit.")) {
      try {
        setLoading(true);
        await moduleService.upsertLessonAssignment({
          moduleId: assignment.moduleId,
          lessonId: assignment.lessonId,
          title: assignment.assignmentTitle,
          description: assignment.assignmentDescription,
          dueDate: new Date().toISOString(),
        });
        await fetchAssignments();
        toast.success("Assignment closed.");
        setIsDetailsOpen(false);
      } catch (error) {
        console.error("Failed to close assignment", error);
        toast.error("Failed to close assignment.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenSubmissions = async (assignment: AssignmentItem) => {
    try {
      setLoading(true);
      setSelectedAssignment(assignment);
      const res = await axiosInstance.get(
        `/api/courses/modules/${assignment.moduleId}/lessons/${assignment.lessonId}/assignment/status/`
      );

      const data: SubmissionApiItem[] = Array.isArray(res.data) ? res.data : [];
      setSubmissions(
        data.map((item) => ({
          submissionId: item.submission_id,
          studentId: item.student_id,
          studentName: item.student_name,
          studentEmail: item.student_email,
          status: item.status,
          submittedAt: item.submitted_at,
          textAnswer: item.submission_data?.text_answer,
          fileUrl: item.submission_data?.file_upload,
          score: item.score ?? null,
          feedback: item.feedback || "",
          gradedAt: item.graded_at ?? null,
          gradedBy: item.graded_by ?? null,
        }))
      );
      setIsSubmissionsOpen(true);
    } catch (error) {
      console.error("Failed to load submissions", error);
      toast.error("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  const openGradeDialog = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score !== null && submission.score !== undefined ? String(submission.score) : "",
      feedback: submission.feedback || "",
    });
    setIsGradeOpen(true);
  };

  const handleSaveGrade = async () => {
    if (!selectedAssignment || !selectedSubmission || !selectedSubmission.submissionId) {
      toast.error("Invalid submission selected.");
      return;
    }

    const parsedScore = Number(gradeData.score);
    if (!Number.isInteger(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      toast.error("Score must be an integer between 0 and 100.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.patch(
        `/api/courses/modules/${selectedAssignment.moduleId}/lessons/${selectedAssignment.lessonId}/assignment/submissions/${selectedSubmission.submissionId}/grade/`,
        {
          score: parsedScore,
          feedback: gradeData.feedback,
        }
      );

      toast.success("Grade saved.");
      setIsGradeOpen(false);
      await handleOpenSubmissions(selectedAssignment);
    } catch (error) {
      console.error("Failed to save grade", error);
      toast.error("Failed to save grade.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Closed": return "bg-red-100 text-red-800 border-red-200";
      case "Submitted": return "bg-green-50 text-green-700 border-green-200";
      case "Not Submitted": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Assignments">
        <div className="flex items-center justify-center min-h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Assignments">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-500 text-sm">Manage course assignments, view submissions, and grade them.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-[#000080] hover:bg-[#000060] text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Assignment
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Search Title</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input placeholder="Search assignments..." className="pl-9 h-10" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Filter Course</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((course) => <option key={course.id} value={String(course.id)}>{course.title}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Filter Status</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {["Draft", "Active", "Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ASSIGNMENTS TABLE */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3">Assignment Title</th>
                <th className="px-4 py-3">Course / Batch</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-center">Submissions</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No assignments found matching filters.</td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => {
                  const isOverdue = !!assignment.assignmentDueDate && new Date(assignment.assignmentDueDate) < new Date() && assignment.status === "Active";

                  return (
                    <tr key={`${assignment.moduleId}-${assignment.lessonId}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {assignment.assignmentTitle}
                        {isOverdue && <Badge variant="outline" className="ml-2 text-red-600 border-red-200 bg-red-50 text-[10px]">Overdue</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#000080]">{assignment.courseTitle}</span>
                          <span className="text-xs text-gray-500">{assignment.moduleTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {assignment.assignmentDueDate
                          ? new Date(assignment.assignmentDueDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                          : "No due date"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{assignment.submissionsCount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`${getStatusColor(assignment.status)} font-medium`}>{assignment.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="View Details" onClick={() => { setSelectedAssignment(assignment); setIsDetailsOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50" title="View Submissions" onClick={() => handleOpenSubmissions(assignment)}>
                            <ListChecks className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100" title="Edit" onClick={() => handleOpenForm(assignment)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50" title="Delete" onClick={() => handleDelete(assignment)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE / EDIT Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAssignment ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>Assignment Title <span className="text-red-500">*</span></Label>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Hooks Implementation" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Description / Instructions <span className="text-red-500">*</span></Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Provide clear instructions..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Course <span className="text-red-500">*</span></Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value, moduleId: "", lessonId: "" })}>
                <option value="" disabled>Select Course</option>
                {courses.map((c) => <option key={c.id} value={String(c.id)}>{c.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Module <span className="text-red-500">*</span></Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.moduleId} onChange={e => setFormData({ ...formData, moduleId: e.target.value, lessonId: "" })}>
                <option value="" disabled>Select Module</option>
                {modules.map((m) => <option key={m.id} value={String(m.id)}>{m.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Lesson <span className="text-red-500">*</span></Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.lessonId} onChange={e => setFormData({ ...formData, lessonId: e.target.value })}>
                <option value="" disabled>Select Lesson</option>
                {lessons.map((l) => <option key={l.id} value={String(l.id)}>{l.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Due Date & Time <span className="text-red-500">*</span></Label>
              <Input type="datetime-local" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleSaveAssignment} disabled={loading || !formData.title || !formData.courseId || !formData.moduleId || !formData.lessonId || !formData.dueDate} className="bg-[#000080] hover:bg-[#000060] text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAILS Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start pr-6">
                  <div>
                    <DialogTitle className="text-xl text-[#000080]">{selectedAssignment.assignmentTitle}</DialogTitle>
                    <CardDescription className="mt-1">{selectedAssignment.courseTitle} • {selectedAssignment.moduleTitle}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(selectedAssignment.status)}`}>{selectedAssignment.status}</Badge>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">{selectedAssignment.assignmentDescription || "No description"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Module:</span> <span className="font-medium">{selectedAssignment.moduleTitle}</span></div>
                  <div><span className="text-gray-500">Lesson:</span> <span className="font-medium">{selectedAssignment.lessonTitle}</span></div>
                  <div><span className="text-gray-500">Due Date:</span> <span className="font-medium">{selectedAssignment.assignmentDueDate ? new Date(selectedAssignment.assignmentDueDate).toLocaleString() : "No due date"}</span></div>
                  <div><span className="text-gray-500">Submissions:</span> <span className="font-medium">{selectedAssignment.submissionsCount}</span></div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => { setIsDetailsOpen(false); handleOpenForm(selectedAssignment); }}>Edit Assignment</Button>
                {selectedAssignment.status === "Active" && (
                  <Button variant="destructive" onClick={() => handleCloseAssignment(selectedAssignment)}>Close Assignment</Button>
                )}
                <Button className="bg-[#000080]" onClick={() => { setIsDetailsOpen(false); handleOpenSubmissions(selectedAssignment); }}>View Submissions</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* SUBMISSIONS LIST Modal */}
      <Dialog open={isSubmissionsOpen} onOpenChange={setIsSubmissionsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle>Submissions: {selectedAssignment.assignmentTitle}</DialogTitle>
                <DialogDescription>Track and grade student submissions for this assignment.</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto py-4">
                <table className="w-full text-sm text-left border">
                  <thead className="bg-slate-50 border-b text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2">Answer</th>
                      <th className="px-4 py-2">Grade</th>
                      <th className="px-4 py-2 text-right">File</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {submissions.map((sub) => (
                      <tr key={sub.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{sub.studentName}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.studentEmail}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                        </td>
                        <td className="px-4 py-3 max-w-[240px]">
                          <p className="line-clamp-2 text-xs text-slate-600">{sub.textAnswer || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {sub.score !== null && sub.score !== undefined ? (
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-800">{sub.score}/100</p>
                              <p className="line-clamp-2">{sub.feedback || "No feedback"}</p>
                              {sub.gradedAt && (
                                <p className="text-[11px] text-slate-500">
                                  Graded {new Date(sub.gradedAt).toLocaleString()}
                                  {sub.gradedBy ? ` by ${sub.gradedBy}` : ""}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {sub.fileUrl ? (
                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                              Open File
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No file</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {sub.status === "Submitted" && sub.submissionId ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openGradeDialog(sub)}
                              className="text-xs"
                            >
                              {sub.score !== null && sub.score !== undefined ? "Edit Grade" : "Grade"}
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr><td colSpan={7} className="py-6 text-center text-gray-500">No submissions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSubmissionsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* GRADE Modal */}
      <Dialog open={isGradeOpen} onOpenChange={setIsGradeOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission ? `Student: ${selectedSubmission.studentName}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Score (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={gradeData.score}
                onChange={(e) => setGradeData((prev) => ({ ...prev, score: e.target.value }))}
                placeholder="e.g. 85"
              />
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                rows={4}
                value={gradeData.feedback}
                onChange={(e) => setGradeData((prev) => ({ ...prev, feedback: e.target.value }))}
                placeholder="Add feedback for the student"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleSaveGrade} disabled={loading} className="bg-[#000080] hover:bg-[#000060] text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default InstructorAssignments;
