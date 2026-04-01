import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LayoutDashboard, Users, UserCheck, Plus, Search,
  CheckCircle, XCircle, Loader2, UsersRound, ChevronDown, ChevronUp, BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import EnrollmentForm from "@/components/EnrollmentForm";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Batches", icon: UsersRound, path: "/admin/batches" },
  // { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      setEnrollments(Array.isArray(data) ? data : data.results || []);
    } catch (error: any) {
      toast.error("Failed to fetch student enrollments.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number | string) => {
    if (!window.confirm("Approve this enrollment? The student will receive an email with login credentials.")) return;
    try {
      setActionLoading(id);
      await axiosInstance.post(`/api/enrollments/admin/enrollments/${id}/approve/`);
      toast.success("Enrollment approved! Confirmation email sent to student.");
      fetchEnrollments();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to approve enrollment.");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number | string) => {
    if (!window.confirm("Reject this enrollment? The student will be notified by email.")) return;
    try {
      setActionLoading(id);
      await axiosInstance.post(`/api/enrollments/admin/enrollments/${id}/reject/`);
      toast.success("Enrollment rejected. Student has been notified.");
      fetchEnrollments();
    } catch (err: any) {
      toast.error("Failed to reject enrollment.");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = enrollments.filter((e) => {
    const matchSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(e.course).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (e as any).status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: enrollments.length,
    pending: enrollments.filter((e) => (e as any).status === "pending").length,
    approved: enrollments.filter((e) => (e as any).status === "approved").length,
    rejected: enrollments.filter((e) => (e as any).status === "rejected").length,
  };

  return (
    <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
      {/* Header */}
      <div className="rounded-2xl mb-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Student Enrollments</h1>
            <p className="text-blue-100 text-sm mt-1">Approve or reject student enrollments — approved students receive login credentials by email.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100">
                <Plus className="w-4 h-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student Enrollment</DialogTitle>
              </DialogHeader>
              <EnrollmentForm onSuccess={() => { setIsAddDialogOpen(false); fetchEnrollments(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
              filterStatus === s
                ? "bg-[#000080] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or course..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Mode</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-400"><Loader2 className="inline animate-spin mr-2 w-4 h-4" />Loading enrollments...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-400">No enrollments found.</td></tr>
                ) : filtered.map((student) => {
                  const enrollmentStatus = (student as any).status || "pending";
                  const isExpanded = expandedId === student.id;
                  const isActioning = actionLoading === student.id;
                  return (
                    <React.Fragment key={student.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-800">{student.name}</td>
                        <td className="px-4 py-3 text-gray-600">{student.email}</td>
                        <td className="px-4 py-3 text-gray-600">{student.phone}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{student.course}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold text-blue-700">{student.course_type}</span>
                            <span className="text-gray-400">{student.preferred_mode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[enrollmentStatus] || "bg-gray-100 text-gray-700"}`}>
                            {enrollmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {enrollmentStatus === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 bg-green-600 hover:bg-green-700 text-white px-3"
                                  disabled={isActioning}
                                  onClick={() => handleApprove(student.id!)}
                                >
                                  {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" />Approve</>}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-red-300 text-red-600 hover:bg-red-50 px-3"
                                  disabled={isActioning}
                                  onClick={() => handleReject(student.id!)}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />Reject
                                </Button>
                              </>
                            )}
                            <button
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                              onClick={() => setExpandedId(isExpanded ? null : (student.id ?? null))}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Qualification</p><p className="text-slate-800 font-semibold mt-0.5">{student.qualification || "—"}</p></div>
                              <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Current Status</p><p className="text-slate-800 font-semibold mt-0.5">{student.current_status || "—"}</p></div>
                              <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Experience Level</p><p className="text-slate-800 font-semibold mt-0.5">{student.experience_level || "—"}</p></div>
                              <div><p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Preferred Timing</p><p className="text-slate-800 font-semibold mt-0.5">{student.preferred_timing || "—"}</p></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default StudentsPage;
