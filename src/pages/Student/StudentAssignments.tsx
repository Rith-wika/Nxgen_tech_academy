import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { studentSidebarItems } from "./studentSidebarItems";
import axiosInstance from "@/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Upload, Loader2, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { courseService } from "@/services/courseService";

interface AssignmentApiItem {
  assignment: {
    id: number;
    module: number;
    title: string;
    assignment_title: string;
    assignment_description: string;
    assignment_due_date?: string | null;
    assignment_file?: string | null;
    file?: string | null;
  };
  course: {
    id: number;
    title: string;
  };
  status: string;
  submitted_at?: string | null;
}

interface AssignmentItem {
  lessonId: number;
  moduleId: number;
  lessonTitle: string;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDueDate: string | null;
  courseTitle: string;
  status: "Not Submitted" | "Submitted" | "Graded";
  submittedAt: string | null;
  instructorFileUrl?: string | null;
}

const normalizeStatus = (value: string | undefined): AssignmentItem["status"] => {
  const normalized = (value || "").toLowerCase();
  if (normalized === "graded") return "Graded";
  if (normalized === "submitted") return "Submitted";
  return "Not Submitted";
};

const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AssignmentItem["status"]>("");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [answerFile, setAnswerFile] = useState<File | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/courses/my-assignments/");
      const data: AssignmentApiItem[] = Array.isArray(res.data) ? res.data : [];

      const mapped: AssignmentItem[] = data.map((item) => ({
        lessonId: item.assignment.id,
        moduleId: item.assignment.module,
        lessonTitle: item.assignment.title,
        assignmentTitle: item.assignment.assignment_title || item.assignment.title,
        assignmentDescription: item.assignment.assignment_description || "",
        assignmentDueDate: item.assignment.assignment_due_date || null,
        courseTitle: item.course.title,
        status: normalizeStatus(item.status),
        submittedAt: item.submitted_at || null,
        instructorFileUrl: item.assignment.file || item.assignment.assignment_file || null,
      }));

      setAssignments(mapped);
    } catch (error) {
      console.error("Failed to load assignments", error);
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const searchTarget = `${item.assignmentTitle} ${item.courseTitle}`.toLowerCase();
      const matchesQuery = searchTarget.includes(query.toLowerCase());
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesQuery && matchesStatus;
    });
  }, [assignments, query, statusFilter]);

  const openSubmitModal = (assignment: AssignmentItem) => {
    setSelectedAssignment(assignment);
    setAnswerText("");
    setAnswerFile(null);
    setIsSubmitOpen(true);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    if (!answerFile) {
      toast.error("Please upload a file for your assignment.");
      return;
    }
    if (!answerText.trim()) {
      toast.error("Please provide a text answer.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("text_answer", answerText.trim());
      if (answerFile) {
        formData.append("file_upload", answerFile);
      }

      await axiosInstance.post(
        `/api/courses/modules/${selectedAssignment.moduleId}/lessons/${selectedAssignment.lessonId}/assignment/submit/`,
        formData
      );

      toast.success("Assignment submitted successfully.");
      setIsSubmitOpen(false);
      await fetchAssignments();
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (id: number, filename: string, type: string = 'lesson') => {
    try {
      const signedUrl = await courseService.getFileAccessUrl(type, id);
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'assignment-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download file.");
    }
  };

  const handleView = async (id: number, type: string = 'lesson') => {
    try {
      const signedUrl = await courseService.getFileAccessUrl(type, id);
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error("View failed", error);
      toast.error("Failed to open file.");
    }
  };

  const getStatusBadgeClasses = (status: AssignmentItem["status"]) => {
    if (status === "Submitted") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "Graded") return "bg-green-50 text-green-700 border-green-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="Assignments">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Assignments</h1>
        <p className="text-sm text-gray-500 mt-1">Track deadlines and submit your assignment work.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500 mb-1 block">Search</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search by assignment or course"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | AssignmentItem["status"])}
            >
              <option value="">All</option>
              <option value="Not Submitted">Not Submitted</option>
              <option value="Submitted">Submitted</option>
              <option value="Graded">Graded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#000080]" />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">No assignments found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((item) => (
            <Card key={`${item.moduleId}-${item.lessonId}`} className="border-l-4 border-l-[#000080]">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.assignmentTitle}</CardTitle>
                    <CardDescription className="mt-1">{item.courseTitle} • {item.lessonTitle}</CardDescription>
                  </div>
                  <Badge className={getStatusBadgeClasses(item.status)}>{item.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{item.assignmentDescription || "No instructions provided."}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <p>
                    Due: {item.assignmentDueDate ? new Date(item.assignmentDueDate).toLocaleString() : "No deadline"}
                    {item.status === "Not Submitted" && isOverdue(item.assignmentDueDate) ? (
                      <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                    ) : null}
                  </p>
                  <p>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Not yet"}</p>
                  {item.instructorFileUrl && (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-gray-700">Instructor material:</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleView(item.lessonId)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-semibold underline">View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(item.lessonId, item.assignmentTitle + (item.instructorFileUrl?.split('.').pop() ? '.' + item.instructorFileUrl.split('.').pop() : ''))}
                          className="flex items-center gap-1.5 text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-semibold underline">Download</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Button
                    onClick={() => openSubmitModal(item)}
                    className="bg-[#000080] hover:bg-[#000060] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {item.status === "Not Submitted" ? "Submit" : "Resubmit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.assignmentTitle || "Submit Assignment"}</DialogTitle>
            <DialogDescription>
              Add your text answer and optionally attach a file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Upload File <span className="text-red-500">*</span></Label>
              <Input
                type="file"
                onChange={(e) => setAnswerFile(e.target.files?.[0] || null)}
              />
              <p className="text-[10px] text-gray-500">Max size: 10MB. Allowed: .pdf, .docx, .png, .jpg, .jpeg</p>
              {answerFile ? <p className="text-xs text-gray-500">Selected: {answerFile.name}</p> : null}
            </div>
            <div className="space-y-2">
              <Label>Text Answer <span className="text-red-500">*</span></Label>
              <Textarea
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your assignment answer"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmitAssignment} disabled={submitting || !answerFile || !answerText.trim()} className="bg-[#000080] hover:bg-[#000060] text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentAssignments;
