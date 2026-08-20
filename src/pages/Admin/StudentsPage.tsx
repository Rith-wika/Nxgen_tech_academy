import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LayoutDashboard, Users, UserCheck, Plus, Search,
  CheckCircle, XCircle, Loader2, UsersRound, ChevronDown, ChevronUp, BookOpen, FileText, Target, CreditCard, Eye, Menu
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import axiosInstance from "@/api/axiosInstance";
import EnrollmentForm from "@/components/EnrollmentForm";
import { adminSidebarItems } from "./adminSidebarItems";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PaymentDialog from "@/components/PaymentDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface GroupedStudent {
  id: string | number;
  email: string;
  name: string;
  phone: string;
  qualification: string;
  current_status: string;
  experience_level: string;
  preferred_timing: string;
  collegeCompanyName: string;
  preferred_mode: string;
  course_type: string;
  enrollments: EnrollmentData[];
}

const groupEnrollments = (data: EnrollmentData[]): GroupedStudent[] => {
  const groups: Record<string, GroupedStudent> = {};
  data.forEach((student) => {
    const key = (student.email || student.phone || student.id || "").toString().toLowerCase().trim();
    if (!groups[key]) {
      groups[key] = {
        id: student.id || "",
        email: student.email || "",
        name: student.name || "",
        phone: student.phone || "",
        qualification: student.qualification || "",
        current_status: student.current_status || "",
        experience_level: student.experience_level || "",
        preferred_timing: student.preferred_timing || "",
        collegeCompanyName: student.collegeCompanyName || "",
        preferred_mode: student.preferred_mode || "",
        course_type: student.course_type || "",
        enrollments: [],
      };
    }
    groups[key].enrollments.push(student);
  });
  return Object.values(groups);
};

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
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState<EnrollmentData | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const [paymentStudent, setPaymentStudent] = useState<EnrollmentData | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [studentForApprove, setStudentForApprove] = useState<{ pendingEnvs: EnrollmentData[]; studentId: number | string } | null>(null);
  const [studentForReject, setStudentForReject] = useState<{ pendingEnvs: EnrollmentData[]; studentId: number | string } | null>(null);
  const navigate = useNavigate();

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

  const handleApproveClick = (pendingEnvs: EnrollmentData[], studentId: number | string) => {
    setStudentForApprove({ pendingEnvs, studentId });
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!studentForApprove) return;
    const { pendingEnvs, studentId } = studentForApprove;
    try {
      setActionLoading(studentId);
      await Promise.all(pendingEnvs.map(env => axiosInstance.post(`/api/enrollments/${env.id}/approve/`)));
      toast.success("Enrollment(s) approved! Confirmation email sent to student.");
      fetchEnrollments();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to approve some enrollments.");
    } finally {
      setActionLoading(null);
      setIsApproveDialogOpen(false);
      setStudentForApprove(null);
    }
  };

  const handleRejectClick = (pendingEnvs: EnrollmentData[], studentId: number | string) => {
    setStudentForReject({ pendingEnvs, studentId });
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!studentForReject) return;
    const { pendingEnvs, studentId } = studentForReject;
    try {
      setActionLoading(studentId);
      await Promise.all(pendingEnvs.map(env => axiosInstance.post(`/api/enrollments/${env.id}/reject/`)));
      toast.success("Enrollment(s) rejected. Student has been notified.");
      fetchEnrollments();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to reject some enrollments.");
    } finally {
      setActionLoading(null);
      setIsRejectDialogOpen(false);
      setStudentForReject(null);
    }
  };

  const groupedList = React.useMemo(() => {
    return groupEnrollments(enrollments);
  }, [enrollments]);

  const filtered = React.useMemo(() => {
    return groupedList.filter((student) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.phone.toLowerCase().includes(searchLower) ||
        student.enrollments.some((env) => (env.course || "").toString().toLowerCase().includes(searchLower));

      const matchStatus =
        filterStatus === "all" ||
        student.enrollments.some((env) => (env.status || "pending") === filterStatus);

      return matchSearch && matchStatus;
    });
  }, [groupedList, search, filterStatus]);

  const counts = React.useMemo(() => {
    return {
      all: groupedList.length,
      pending: groupedList.filter((student) => student.enrollments.some((env) => (env.status || "pending") === "pending")).length,
      approved: groupedList.filter((student) => student.enrollments.some((env) => env.status === "approved")).length,
      rejected: groupedList.filter((student) => student.enrollments.some((env) => env.status === "rejected")).length,
    };
  }, [groupedList]);

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pb-0">
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
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${filterStatus === s
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
                  <th className="px-4 py-3 font-semibold">Student Details</th>
                  <th className="px-4 py-3 font-semibold">Course(s)</th>
                  <th className="px-4 py-3 font-semibold">Mode</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="py-12 text-center text-gray-400"><Loader2 className="inline animate-spin mr-2 w-4 h-4" />Loading enrollments...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-gray-400">No enrollments found.</td></tr>
                ) : filtered.map((student) => {
                  const isExpanded = expandedId === student.id;
                  return (
                    <React.Fragment key={student.id}>
                      <tr
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900 text-base">{student.name}</span>
                            <span className="text-xs text-gray-500">{student.email}</span>
                            <span className="text-xs text-gray-500">{student.phone}</span>
                            {student.enrollments.filter(env => (env.status || "pending") === "pending").length > 0 && (
                              <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                <span className="text-xs font-semibold text-gray-500">Action:</span>
                                <Button
                                  size="sm"
                                  className="h-6 bg-green-600 hover:bg-green-700 text-white px-2 text-[10px]"
                                  disabled={actionLoading === student.id}
                                  onClick={() => handleApproveClick(student.enrollments.filter(env => (env.status || "pending") === "pending"), student.id)}
                                >
                                  {actionLoading === student.id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "Approve"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 px-2 text-[10px]"
                                  disabled={actionLoading === student.id}
                                  onClick={() => handleRejectClick(student.enrollments.filter(env => (env.status || "pending") === "pending"), student.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            {student.enrollments.map((env) => (
                              <span key={env.id} className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-semibold w-fit">
                                {env.course}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">
                            {student.enrollments.map((env) => (
                              <div key={env.id} className="flex flex-col text-xs">
                                <span className="font-semibold text-blue-700">{env.course_type}</span>
                                <span className="text-gray-400">{env.preferred_mode}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            {student.enrollments.map((env) => (
                              <span key={env.id} className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize w-fit ${STATUS_COLORS[env.status || "pending"] || "bg-gray-100 text-gray-700"}`}>
                                {env.status || "pending"}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
                                >
                                  <Menu className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white text-slate-900 border shadow-md rounded-md p-1">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedStudentForAssign(student.enrollments[0]);
                                    setTimeout(() => setIsAssignDialogOpen(true), 150);
                                  }}
                                  className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer rounded-sm gap-2 font-medium"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Enroll Course</span>
                                </DropdownMenuItem>

                                {student.enrollments.map((env) => (
                                  <DropdownMenuItem
                                    key={env.id}
                                    onClick={() => setTimeout(() => setPaymentStudent(env), 150)}
                                    className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-sm gap-2 font-medium"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Payment: {env.course}</span>
                                  </DropdownMenuItem>
                                ))}

                                <DropdownMenuItem
                                  onClick={() => setTimeout(() => navigate(`/admin/students/${student.id}`), 150)}
                                  className="flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer rounded-sm gap-2 font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={5} className="px-6 py-4">
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

      {/* Enroll in Additional Course Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={(open) => {
        setIsAssignDialogOpen(open);
        if (!open) setSelectedStudentForAssign(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pb-0">
          <DialogHeader>
            <DialogTitle>Enroll Student in Additional Course</DialogTitle>
          </DialogHeader>
          {selectedStudentForAssign && (
            <EnrollmentForm
              initialData={{
                name: selectedStudentForAssign.name,
                email: selectedStudentForAssign.email,
                phone: selectedStudentForAssign.phone,
                qualification: selectedStudentForAssign.qualification,
                current_status: selectedStudentForAssign.current_status,
                collegeCompanyName: selectedStudentForAssign.collegeCompanyName,
                preferred_mode: selectedStudentForAssign.preferred_mode,
                preferred_timing: selectedStudentForAssign.preferred_timing,
                experience_level: selectedStudentForAssign.experience_level,
                fee_status: "Pending", // Default new enrollment to Pending fee status
              }}
              onSuccess={() => {
                setIsAssignDialogOpen(false);
                setSelectedStudentForAssign(null);
                fetchEnrollments();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {paymentStudent && (
        <PaymentDialog
          isOpen={!!paymentStudent}
          onClose={() => setPaymentStudent(null)}
          student={paymentStudent}
          onSuccess={fetchEnrollments}
        />
      )}

      <DeleteConfirmDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={handleConfirmApprove}
        title="Approve Enrollment"
        description="Are you sure you want to approve all pending enrollments for this student? The student will receive an email with login credentials."
        confirmText="Approve"
        variant="default"
      />

      <DeleteConfirmDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={handleConfirmReject}
        title="Reject Enrollment"
        description="Are you sure you want to reject all pending enrollments for this student? The student will be notified by email."
        confirmText="Reject"
        variant="destructive"
      />
    </DashboardLayout>
  );
};

export default StudentsPage;
