import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LayoutDashboard, BookOpen, Users, User, ArrowLeft, Loader2, Mail, Phone, FileText,
  ChevronDown, ChevronRight, CheckCircle, Clock, ExternalLink, GraduationCap,
  Layers, ChevronRightSquare
} from "lucide-react";
import { batchService, Batch } from "@/services/batchService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

interface AssignmentProgressItem {
  status: string;
  submitted_at?: string | null;
  submission_data?: {
    file_upload?: string;
  };
  assignment: {
    title?: string;
    assignment_title?: string;
  };
  module?: {
    title?: string;
  };
  course?: {
    title?: string;
  };
}

interface DashboardStudent {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

const InstructorStudents = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  
  // Live Class States
  const [liveLinks, setLiveLinks] = useState<{ [batchId: number]: string }>({});
  const [startingClassFor, setStartingClassFor] = useState<number | null>(null);

  // Student Assignment Tracking
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const [studentAssignments, setStudentAssignments] = useState<Record<number, AssignmentProgressItem[]>>({});
  const [subLoading, setSubLoading] = useState<number | null>(null);

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
    const fetchBatches = async () => {
      try {
        const data = await batchService.getInstructorBatches();
        setBatches(data);
        if (data.length > 0) {
          // Set first course as active by default
          setActiveCourseId(data[0].course_id);
        }
      } catch (error) {
        console.error("Failed to load batches", error);
        toast.error("Failed to load your assigned batches.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const courses = useMemo(() => {
    const unique = new Map();
    batches.forEach(b => {
      if (!unique.has(b.course_id)) {
        unique.set(b.course_id, b.course_title);
      }
    });
    return Array.from(unique.entries()).map(([id, title]) => ({ id, title }));
  }, [batches]);

  const filteredBatches = useMemo(() => {
    return batches.filter(b => b.course_id === activeCourseId);
  }, [batches, activeCourseId]);

  const handleLiveClassToggle = async (batchId: number, start: boolean) => {
    setStartingClassFor(batchId);
    try {
      const link = start ? liveLinks[batchId] : undefined;
      if (start && (!link || link.trim() === "")) {
        toast.error("Please provide a meeting link");
        setStartingClassFor(null);
        return;
      }
      const response = await batchService.manageLiveClass(batchId, start ? 'start' : 'end', link);
      toast.success(response.message);
      
      // Update local state
      setBatches(prev => prev.map(b => b.id === batchId ? { ...b, is_live_class_active: start, live_link: start ? link : "" } : b));
      if (!start) {
        setLiveLinks(prev => ({ ...prev, [batchId]: "" }));
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to manage live class");
    } finally {
      setStartingClassFor(null);
    }
  };

  const toggleStudentAssignments = async (studentId: number) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
      return;
    }
    
    setExpandedStudent(studentId);
    if (studentAssignments[studentId]) return;

    try {
      setSubLoading(studentId);
      const res = await axiosInstance.get(`/api/courses/student-assignments/${studentId}/`);
      setStudentAssignments(prev => ({ ...prev, [studentId]: res.data }));
    } catch (err) {
      toast.error("Failed to load student assignment progress.");
    } finally {
      setSubLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Loading Students...">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="My Batches & Students">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-8 space-y-6">
        
        {/* Header Section */}
        <div className="mt-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-[#000080]">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Instructor Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Batches & Students</h1>
              <p className="text-sm text-gray-500 mt-1">View students in your assigned batches and track their assignment progress.</p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 bg-[#000080] hover:bg-[#000060] text-white rounded-lg transition-colors flex items-center font-medium"
              onClick={() => navigate("/instructor/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {batches.length === 0 ? (
          <Card className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-white text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Batches Assigned</h2>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't been assigned any student batches yet. Contact your administrator if this is an error.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Course Tabs Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setActiveCourseId(course.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeCourseId === course.id
                      ? "bg-[#000080] text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${activeCourseId === course.id ? "text-blue-300" : "text-slate-400"}`} />
                  {course.title}
                </button>
              ))}
            </div>

            {/* Content for Active Course */}
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <Card key={batch.id} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow border-t-4 border-t-[#000080]">
                    <CardHeader className="bg-white border-b border-slate-100 px-6 py-5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                            <Layers className="w-6 h-6 text-[#000080]" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-800">{batch.name}</CardTitle>
                            <CardDescription className="text-indigo-600 mt-0.5 font-semibold text-xs uppercase tracking-tight flex items-center gap-1.5">
                              Course ID: {batch.course_id}
                            </CardDescription>
                          </div>
                        </div>
                          <div className="flex items-center gap-4">
                            {!batch.is_live_class_active ? (
                              <div className="flex bg-white items-center p-1 rounded-md border border-slate-200">
                                <input 
                                  value={liveLinks[batch.id] || ""}
                                  onChange={(e) => setLiveLinks(p => ({ ...p, [batch.id]: e.target.value }))}
                                  placeholder="Teams/Zoom Link"
                                  className="text-sm px-2 py-1 outline-none min-w-[200px]"
                                />
                                <button
                                  onClick={() => handleLiveClassToggle(batch.id, true)}
                                  disabled={startingClassFor === batch.id}
                                  className="bg-[#000080] text-white text-xs px-3 py-1.5 rounded disabled:opacity-50"
                                >
                                  {startingClassFor === batch.id ? "Starting..." : "Start Class"}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center bg-red-50 p-1 px-3 rounded-md border border-red-200 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                  <span className="text-red-700 text-xs font-bold">Class Live</span>
                                </div>
                                <button
                                  onClick={() => handleLiveClassToggle(batch.id, false)}
                                  disabled={startingClassFor === batch.id}
                                  className="bg-red-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                                >
                                  {startingClassFor === batch.id ? "Ending..." : "End Class"}
                                </button>
                              </div>
                            )}

                            <div className="bg-blue-100 text-[#000080] text-xs px-4 py-1.5 rounded-full font-semibold">
                              {batch.students.length} Enrolled Students
                            </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {batch.students.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="font-medium">No students have been added to this batch yet.</p>
                        </div>
                      ) : (
                        <div className="overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 font-semibold">
                              <tr>
                                <th className="px-6 py-4">Student Profile</th>
                                <th className="px-6 py-4">Contact Information</th>
                                <th className="px-6 py-4 text-right">Progress Tracking</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(batch.students as DashboardStudent[]).map((student) => {
                                const isExpanded = expandedStudent === student.id;
                                const assignments = studentAssignments[student.id] || [];
                                const isLoading = subLoading === student.id;

                                return (
                                  <React.Fragment key={student.id}>
                                    <tr className="bg-white hover:bg-blue-50/20 transition-colors group">
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                          <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-[#000080] text-white flex items-center justify-center font-bold text-sm uppercase">
                                              {student.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Active student" />
                                          </div>
                                          <div>
                                            <div className="font-bold text-slate-800 text-base">{student.name}</div>
                                            <div className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 inline-block font-semibold">UID: STU-{student.id}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 text-slate-600">
                                          <div className="flex items-center gap-2 group/info">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                              <Mail className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <span className="group-hover/info:text-blue-600 transition-colors">{student.email}</span>
                                          </div>
                                          {student.phone && (
                                            <div className="flex items-center gap-2 group/info">
                                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <Phone className="w-3 h-3 text-slate-400" />
                                              </div>
                                              <span className="group-hover/info:text-blue-600 transition-colors">{student.phone}</span>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <button
                                          onClick={() => toggleStudentAssignments(student.id)}
                                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            isExpanded 
                                              ? "bg-[#000080] text-white" 
                                              : "bg-[#000080]/5 text-[#000080] hover:bg-[#000080] hover:text-white"
                                          }`}
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                          {isExpanded ? "Close Overview" : "Analyze Progress"}
                                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRightSquare className="w-3 h-3" />}
                                        </button>
                                      </td>
                                    </tr>

                                    {/* Expandable Assignment Progress */}
                                    {isExpanded && (
                                      <tr>
                                        <td colSpan={3} className="px-6 py-8 bg-slate-50/50 border-y border-slate-100 relative">
                                          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-indigo-100 opacity-50" />
                                          
                                          <div className="max-w-4xl mx-auto space-y-6">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 text-[#000080]" />
                                                Learning Path Overview
                                              </h4>
                                              {assignments.length > 0 && (
                                                <div className="flex flex-col items-end">
                                                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#000080] bg-blue-100 px-4 py-1.5 rounded-full mb-1">
                                                    {Math.round((assignments.filter((a) => a.status === 'Submitted').length / assignments.length) * 100)}% Course Completed
                                                  </span>
                                                  <p className="text-[10px] text-slate-400 font-bold">{assignments.filter((a) => a.status === 'Submitted').length} of {assignments.length} assignments done</p>
                                                </div>
                                              )}
                                            </div>

                                            {isLoading ? (
                                              <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                                                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                                                <p className="text-xs font-bold tracking-widest uppercase">Fetching performance data...</p>
                                              </div>
                                            ) : assignments.length === 0 ? (
                                              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Zero assignment activity recorded</p>
                                              </div>
                                            ) : (
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {assignments.map((item, idx: number) => (
                                                  <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white border-l-4 border-l-indigo-100">
                                                    <div className="p-4 flex items-start gap-4">
                                                      <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        item.status === 'Submitted' 
                                                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                      }`}>
                                                        {item.status === 'Submitted' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] mb-1 truncate">
                                                            {item.course?.title || "No Course"} — {item.module?.title || "No Module"}
                                                         </p>
                                                        <h5 className="font-bold text-slate-800 text-sm truncate mb-3" title={item.assignment.assignment_title}>
                                                          {item.assignment.assignment_title || item.assignment.title}
                                                        </h5>
                                                        
                                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                                            item.status === 'Submitted' ? 'text-emerald-500' : 'text-amber-500'
                                                          }`}>
                                                            {item.status}
                                                          </span>
                                                          
                                                          {item.submitted_at ? (
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                              {new Date(item.submitted_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                                            </span>
                                                          ) : (
                                                            <span className="text-[10px] text-red-300 font-bold uppercase">Overdue</span>
                                                          )}
                                                          
                                                          {item.submission_data?.file_upload && (
                                                            <a 
                                                              href={item.submission_data.file_upload} 
                                                              target="_blank" 
                                                              rel="noreferrer"
                                                              className="text-[10px] text-blue-600 hover:text-blue-800 font-black flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                                                            >
                                                              <ExternalLink className="w-3 h-3" /> REVIEW
                                                            </a>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </Card>
                                                ))}
                                              </div>
                                            )}
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
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No batches found for this course selection.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorStudents;
