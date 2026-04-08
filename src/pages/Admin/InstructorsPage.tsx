import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Plus, Search, Edit2, Loader2, UsersRound, X, Save, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { instructorService } from "@/services/instructorService";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Batches", icon: UsersRound, path: "/admin/batches" },
  // { label: "Settings", icon: Settings, path: "/admin/settings" },
];

interface EditForm {
  full_name: string;
  phone: string;
  qualification: string;
  experience: string;
  is_active: boolean;
  assigned_courses: number[];
  date_of_joining: string;
  employee_id: string;
}

const InstructorsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructorList, setInstructorList] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    full_name: "",
    phone: "",
    qualification: "",
    experience: "",
    is_active: true,
    assigned_courses: [],
    date_of_joining: "",
    employee_id: "",
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [insData, coursesRes] = await Promise.all([
        instructorService.getAllInstructors(),
        axiosInstance.get("/api/courses/courses/")
      ]);
      setInstructorList(Array.isArray(insData) ? insData : (insData.results || []));
      setAvailableCourses(coursesRes.data);
    } catch (error) {
      toast.error("Failed to load information.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openEdit = (instructor: any) => {
    setEditTarget(instructor);
    setEditForm({
      full_name: instructor.full_name || instructor.name || "",
      phone: instructor.phone || "",
      qualification: instructor.qualification || "",
      experience: instructor.experience || "",
      is_active: instructor.is_active ?? true,
      assigned_courses: (instructor.courses || []).map((c: any) => c.id),
      date_of_joining: instructor.date_of_joining || "",
      employee_id: instructor.employee_id || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    try {
      setSaving(true);
      const payload = {
        ...editForm,
        date_of_joining: editForm.date_of_joining || null,
        qualification: editForm.qualification || null,
        employee_id: editForm.employee_id || null,
      };
      await axiosInstance.patch(`/api/instructors/${editTarget.id}/`, payload);
      toast.success("Instructor updated successfully.");
      setEditTarget(null);
      fetchAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update instructor.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (instructor: any) => {
    if (!window.confirm(`Deactivate instructor "${instructor.full_name || instructor.name}"?`)) return;
    try {
      await axiosInstance.post(`/api/instructors/${instructor.id}/deactivate/`);
      toast.success("Instructor deactivated.");
      fetchAllData();
    } catch (err) {
      toast.error("Failed to deactivate instructor.");
    }
  };

  const filtered = instructorList.filter((ins) =>
    (ins.full_name || ins.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (ins.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (ins.employee_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
      {/* Header */}
      <div className="rounded-2xl mb-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Manage Instructors</h1>
            <p className="text-blue-100 text-sm mt-1">Edit instructor details or deactivate access from here.</p>
          </div>
          <Button
            className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100"
            onClick={() => navigate("/admin/instructors/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Instructor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search instructors..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr className="text-slate-500">
                    <th className="px-4 py-3 font-semibold">Employee ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">No instructors found</td>
                    </tr>
                  ) : (
                    filtered.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-600">{instructor.employee_id || "N/A"}</td>
                        <td className="px-4 py-3 font-semibold text-indigo-900">{instructor.full_name || instructor.name}</td>
                        <td className="px-4 py-3 text-gray-600">{instructor.email}</td>
                        <td className="px-4 py-3 text-gray-600">{instructor.phone || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${instructor.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {instructor.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Instructor"
                              onClick={() => openEdit(instructor)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {instructor.is_active && (
                              <button
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                onClick={() => handleDeactivate(instructor)}
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Qualification</Label>
                <Input value={editForm.qualification} onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Experience</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  value={editForm.experience}
                  onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1–3 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Employee ID</Label>
                <Input value={editForm.employee_id} onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Date of Joining</Label>
                <Input type="date" value={editForm.date_of_joining} onChange={(e) => setEditForm({ ...editForm, date_of_joining: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#000080]" />
                Assigned Courses
              </Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1 bg-slate-50">
                {availableCourses.map((course) => (
                  <label key={course.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white rounded transition-colors cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="rounded text-[#000080]"
                      checked={editForm.assigned_courses.includes(course.id)}
                      onChange={(e) => {
                        const newCourses = e.target.checked
                          ? [...editForm.assigned_courses, course.id]
                          : editForm.assigned_courses.filter(id => id !== course.id);
                        setEditForm({ ...editForm, assigned_courses: newCourses });
                      }}
                    />
                    {course.title}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Active Status</Label>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                className={`relative w-11 h-6 rounded-full transition-colors ${editForm.is_active ? "bg-green-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${editForm.is_active ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditTarget(null)} disabled={saving}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button className="bg-[#000080] hover:bg-[#000060]" onClick={handleSaveEdit} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InstructorsPage;
