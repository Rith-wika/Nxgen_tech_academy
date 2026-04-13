import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LayoutDashboard, BookOpen, Users, User, FileText, Plus, Search,
  Eye, Edit, Trash2, Calendar, FileDown, CheckCircle, FileUp, ListChecks,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ========================
// MODELS & MOCK DATA
// ========================

type AssignmentStatus = "Draft" | "Active" | "Closed" | "Graded";
type SubmissionStatus = "Submitted" | "Late" | "Not Submitted";

interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  submissionDate: string | null;
  status: SubmissionStatus;
  marks: number | null;
  feedback: string;
  fileUrl?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  module: string;
  batch: string;
  dueDate: string;
  maxMarks: number;
  type: string; // Coding, Theory, Quiz
  status: AssignmentStatus;
  fileUrl?: string;
}

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/instructor/courses" },
  { label: "Students", icon: Users, path: "/instructor/students" },
  { label: "Assignments", icon: FileText, path: "/instructor/assignments" },
  { label: "Profile", icon: User, path: "/instructor/profile" },
];

const mockAssignments: Assignment[] = [
  {
    id: "a1", title: "React Hooks Implementation", description: "Implement a custom hook.", course: "React Mastery", module: "Hooks", batch: "Batch A", dueDate: "2026-04-20T23:59", maxMarks: 100, type: "Coding", status: "Active"
  },
  {
    id: "a2", title: "SAP ABAP Fundamentals", description: "Answer the theory questions.", course: "SAP ABAP", module: "Basics", batch: "Batch C", dueDate: "2026-03-10T23:59", maxMarks: 50, type: "Theory", status: "Closed"
  }
];

const mockSubmissions: Submission[] = [
  { id: "s1", assignmentId: "a1", studentName: "John Doe", submissionDate: "2026-04-12T10:00", status: "Submitted", marks: null, feedback: "" },
  { id: "s2", assignmentId: "a1", studentName: "Jane Smith", submissionDate: null, status: "Not Submitted", marks: null, feedback: "" },
  { id: "s3", assignmentId: "a2", studentName: "John Doe", submissionDate: "2026-03-11T08:00", status: "Late", marks: 40, feedback: "Good effort." },
];

const mockCourses = ["React Mastery", "SAP ABAP", "Python Data Science"];
const mockBatches = ["Batch A", "Batch B", "Batch C"];
const mockTypes = ["Coding", "Theory", "Quiz"];

const initialFormState = {
  title: "", description: "", course: "", module: "", batch: "", dueDate: "", maxMarks: 100, type: "Coding",
};

// ========================
// MAIN COMPONENT
// ========================

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);

  // Selected State
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [gradeData, setGradeData] = useState({ marks: 0, feedback: "" });

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchCourse = filterCourse ? a.course === filterCourse : true;
      const matchBatch = filterBatch ? a.batch === filterBatch : true;
      const matchStatus = filterStatus ? a.status === filterStatus : true;
      const matchSearch = a.title.toLowerCase().includes(filterSearch.toLowerCase());
      return matchCourse && matchBatch && matchStatus && matchSearch;
    });
  }, [assignments, filterCourse, filterBatch, filterStatus, filterSearch]);

  const getSubmissionsForAssignment = (id: string) => submissions.filter(s => s.assignmentId === id);

  // ========================
  // HANDLERS
  // ========================

  const handleOpenForm = (assignment?: Assignment) => {
    if (assignment) {
      setFormData({
        title: assignment.title, description: assignment.description, course: assignment.course,
        module: assignment.module, batch: assignment.batch, dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks, type: assignment.type
      });
      setSelectedAssignment(assignment);
    } else {
      setFormData(initialFormState);
      setSelectedAssignment(null);
    }
    setIsFormOpen(true);
  };

  const handleSaveAssignment = async (status: AssignmentStatus) => {
    if (!formData.title || !formData.course || !formData.batch || !formData.dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (new Date(formData.dueDate) < new Date()) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedAssignment) {
        setAssignments(prev => prev.map(a => a.id === selectedAssignment.id ? { ...a, ...formData, status } : a));
        toast.success(`Assignment updated successfully!`);
      } else {
        const newAssignment: Assignment = {
          id: `a${Date.now()}`,
          ...formData,
          status,
        };
        setAssignments(prev => [newAssignment, ...prev]);
        toast.success(`Assignment created successfully!`);
      }
      setLoading(false);
      setIsFormOpen(false);
    }, 600);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      setSubmissions(prev => prev.filter(s => s.assignmentId !== id));
      toast.success("Assignment deleted.");
    }
  };

  const handleCloseAssignment = (id: string) => {
    if (window.confirm("Close this assignment? Students will no longer submit.")) {
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: "Closed" } : a));
      toast.success("Assignment closed.");
      setIsDetailsOpen(false);
    }
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;
    setLoading(true);
    setTimeout(() => {
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? {
        ...s, marks: gradeData.marks, feedback: gradeData.feedback
      } : s));
      toast.success("Grade submitted successfully.");
      setLoading(false);
      setIsGradeOpen(false);
    }, 600);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Closed": return "bg-red-100 text-red-800 border-red-200";
      case "Graded": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Submitted": return "bg-green-50 text-green-700 border-green-200";
      case "Late": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Not Submitted": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
              {mockCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Filter Batch</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}>
              <option value="">All Batches</option>
              {mockBatches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Filter Status</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {["Draft", "Active", "Closed", "Graded"].map(s => <option key={s} value={s}>{s}</option>)}
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
                  const subs = getSubmissionsForAssignment(assignment.id);
                  const submittedCount = subs.filter(s => s.status !== "Not Submitted").length;
                  const totalCount = subs.length;
                  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === "Active";

                  return (
                    <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {assignment.title}
                        {isOverdue && <Badge variant="outline" className="ml-2 text-red-600 border-red-200 bg-red-50 text-[10px]">Overdue</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#000080]">{assignment.course}</span>
                          <span className="text-xs text-gray-500">{assignment.batch}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(assignment.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{submittedCount}</span> <span className="text-gray-400">/ {totalCount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`${getStatusColor(assignment.status)} font-medium`}>{assignment.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="View Details" onClick={() => { setSelectedAssignment(assignment); setIsDetailsOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50" title="View Submissions" onClick={() => { setSelectedAssignment(assignment); setIsSubmissionsOpen(true); }}>
                            <ListChecks className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100" title="Edit" onClick={() => handleOpenForm(assignment)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50" title="Delete" onClick={() => handleDelete(assignment.id)}>
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
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })}>
                <option value="" disabled>Select Course</option>
                {mockCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Module</Label>
              <Input value={formData.module} onChange={e => setFormData({ ...formData, module: e.target.value })} placeholder="e.g. Module 2" />
            </div>
            <div className="space-y-2">
              <Label>Batch <span className="text-red-500">*</span></Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })}>
                <option value="" disabled>Select Batch</option>
                {mockBatches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Due Date & Time <span className="text-red-500">*</span></Label>
              <Input type="datetime-local" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Assignment Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                {mockTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Maximum Marks</Label>
              <Input type="number" min="0" value={formData.maxMarks} onChange={e => setFormData({ ...formData, maxMarks: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-2 space-y-2 mt-2">
              <Label>Attach File (Optional)</Label>
              <Input type="file" className="cursor-pointer" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={loading}>Cancel</Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleSaveAssignment("Draft")} disabled={loading || !formData.title || !formData.course}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save as Draft
              </Button>
              <Button onClick={() => handleSaveAssignment("Active")} disabled={loading || !formData.title || !formData.course || !formData.batch || !formData.dueDate} className="bg-[#000080] hover:bg-[#000060] text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Publish Assignment
              </Button>
            </div>
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
                    <DialogTitle className="text-xl text-[#000080]">{selectedAssignment.title}</DialogTitle>
                    <CardDescription className="mt-1">{selectedAssignment.course} • {selectedAssignment.batch}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(selectedAssignment.status)}`}>{selectedAssignment.status}</Badge>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">{selectedAssignment.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Module:</span> <span className="font-medium">{selectedAssignment.module || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Type:</span> <span className="font-medium">{selectedAssignment.type}</span></div>
                  <div><span className="text-gray-500">Due Date:</span> <span className="font-medium">{new Date(selectedAssignment.dueDate).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Max Marks:</span> <span className="font-medium">{selectedAssignment.maxMarks}</span></div>
                </div>

                {/* Submissions Summary */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Submissions Summary</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                      <div className="text-lg font-bold text-gray-700">{getSubmissionsForAssignment(selectedAssignment.id).length}</div>
                      <div className="text-[10px] uppercase text-gray-500 font-semibold mt-1">Total</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-100">
                      <div className="text-lg font-bold text-green-700">{getSubmissionsForAssignment(selectedAssignment.id).filter(s => s.status === "Submitted").length}</div>
                      <div className="text-[10px] uppercase text-green-600 font-semibold mt-1">Submitted</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded border border-orange-100">
                      <div className="text-lg font-bold text-orange-700">{getSubmissionsForAssignment(selectedAssignment.id).filter(s => s.status === "Late").length}</div>
                      <div className="text-[10px] uppercase text-orange-600 font-semibold mt-1">Late</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded border border-red-100">
                      <div className="text-lg font-bold text-red-700">{getSubmissionsForAssignment(selectedAssignment.id).filter(s => s.status === "Not Submitted").length}</div>
                      <div className="text-[10px] uppercase text-red-600 font-semibold mt-1">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => { setIsDetailsOpen(false); handleOpenForm(selectedAssignment); }}>Edit Assignment</Button>
                {selectedAssignment.status === "Active" && (
                  <Button variant="destructive" onClick={() => handleCloseAssignment(selectedAssignment.id)}>Close Assignment</Button>
                )}
                <Button className="bg-[#000080]" onClick={() => { setIsDetailsOpen(false); setIsSubmissionsOpen(true); }}>View Submissions</Button>
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
                <DialogTitle>Submissions: {selectedAssignment.title}</DialogTitle>
                <DialogDescription>Track and grade student submissions for this assignment.</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto py-4">
                <table className="w-full text-sm text-left border">
                  <thead className="bg-slate-50 border-b text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Marks</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {getSubmissionsForAssignment(selectedAssignment.id).map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{sub.studentName}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.submissionDate ? new Date(sub.submissionDate).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {sub.marks !== null ? `${sub.marks}/${selectedAssignment.maxMarks}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant={sub.marks !== null ? "outline" : "default"} className={sub.marks === null && sub.status !== "Not Submitted" ? "bg-[#000080] text-white hover:bg-[#000060]" : ""} disabled={sub.status === "Not Submitted"} onClick={() => { setSelectedSubmission(sub); setGradeData({ marks: sub.marks || 0, feedback: sub.feedback }); setIsGradeOpen(true); }}>
                            {sub.marks !== null ? "Edit Grade" : "Grade"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {getSubmissionsForAssignment(selectedAssignment.id).length === 0 && (
                      <tr><td colSpan={5} className="py-6 text-center text-gray-500">No submissions found.</td></tr>
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

      {/* GRADE SUBMISSION Modal */}
      <Dialog open={isGradeOpen} onOpenChange={setIsGradeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedSubmission && selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle>Grade Submission</DialogTitle>
                <DialogDescription>Evaluating <strong>{selectedSubmission.studentName}</strong>'s work.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Submitted Files</p>
                      <p className="text-xs text-blue-700">submission_{selectedSubmission.studentName.replace(' ', '_')}.pdf</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white"><FileDown className="w-4 h-4 mr-2" /> Download</Button>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="marks" className="text-right font-medium">Marks</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input id="marks" type="number" className="w-24 text-center font-bold" min="0" max={selectedAssignment.maxMarks} value={gradeData.marks} onChange={e => setGradeData({ ...gradeData, marks: Number(e.target.value) })} />
                    <span className="text-gray-500">/ {selectedAssignment.maxMarks}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label htmlFor="feedback" className="text-right font-medium pt-2">Feedback</Label>
                  <Textarea id="feedback" className="col-span-3" rows={4} placeholder="Constructive feedback for the student..." value={gradeData.feedback} onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGradeOpen(false)} disabled={loading}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={loading} onClick={handleSaveGrade}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />} Submit Grade
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default InstructorAssignments;
