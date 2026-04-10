import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LayoutDashboard, Users, UserCheck, Plus, Search,
  Edit2, Trash2, BookOpen, UsersRound, Loader2, X, Save, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
       
interface Category { id: number; name: string; slug: string; is_active: boolean; }
interface Course { id: number; title: string; description: string; price: string; is_active: boolean; category: number; }

const emptyForm = { title: "", description: "", price: "", category: "", is_active: true };

const AdminCourses = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "categories">("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Course dialog
  const [courseDialog, setCourseDialog] = useState<{ open: boolean; mode: "create" | "edit"; data: any }>({ open: false, mode: "create", data: emptyForm });
  // Category dialog
  const [catDialog, setCatDialog] = useState<{ open: boolean; mode: "create" | "edit"; data: any }>({ open: false, mode: "create", data: { name: "", slug: "", is_active: true } });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cRes, catRes] = await Promise.all([
        axiosInstance.get("/api/courses/courses/"),
        axiosInstance.get("/api/courses/categories/"),
      ]);
      const cData = cRes.data;
      const catData = catRes.data;
      setCourses(Array.isArray(cData) ? cData : cData.results || []);
      // categories come with nested courses; flatten
      setCategories(
        (Array.isArray(catData) ? catData : catData.results || []).map((c: any) => ({
          id: c.id, name: c.name, slug: c.slug, is_active: c.is_active
        }))
      );
    } catch (err) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // ──── COURSE CRUD ────────────────────────────────────────
  const openCreateCourse = () => setCourseDialog({ open: true, mode: "create", data: { ...emptyForm } });
  const openEditCourse = (c: Course) => setCourseDialog({
    open: true, mode: "edit",
    data: { title: c.title, description: c.description, price: c.price, category: String(c.category), is_active: c.is_active, id: c.id }
  });

  const saveCourse = async () => {
    const { id, mode, ...rest } = courseDialog.data;
    if (!rest.title || !rest.category || !rest.price) { toast.error("Title, category and price are required."); return; }
    try {
      setSaving(true);
      const payload = { ...rest, price: parseFloat(rest.price), category: Number(rest.category) };
      if (courseDialog.mode === "create") {
        await axiosInstance.post("/api/courses/courses/", payload);
        toast.success("Course created!");
      } else {
        await axiosInstance.put(`/api/courses/courses/${id}/`, payload);
        toast.success("Course updated!");
      }
      setCourseDialog({ open: false, mode: "create", data: emptyForm });
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/api/courses/courses/${id}/`);
      toast.success("Course deleted.");
      fetchAll();
    } catch { toast.error("Delete failed."); }
  };

  // ──── CATEGORY CRUD ──────────────────────────────────────
  const openCreateCat = () => setCatDialog({ open: true, mode: "create", data: { name: "", slug: "", is_active: true } });
  const openEditCat = (c: Category) => setCatDialog({
    open: true, mode: "edit", data: { id: c.id, name: c.name, slug: c.slug, is_active: c.is_active }
  });

  const saveCat = async () => {
    const { id, ...rest } = catDialog.data;
    if (!rest.name) { toast.error("Category name is required."); return; }
    if (!rest.slug) rest.slug = rest.name.toLowerCase().replace(/\s+/g, "-");
    try {
      setSaving(true);
      if (catDialog.mode === "create") {
        await axiosInstance.post("/api/courses/categories/", rest);
        toast.success("Category created!");
      } else {
        await axiosInstance.put(`/api/courses/categories/${id}/`, rest);
        toast.success("Category updated!");
      }
      setCatDialog({ open: false, mode: "create", data: { name: "", slug: "", is_active: true } });
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCat = async (id: number) => {
    if (!window.confirm("Delete this category? All courses in it may be affected.")) return;
    try {
      await axiosInstance.delete(`/api/courses/categories/${id}/`);
      toast.success("Category deleted.");
      fetchAll();
    } catch { toast.error("Delete failed."); }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    String(c.category).includes(search)
  );
  const filteredCats = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
      {/* Header */}
      <div className="rounded-2xl mb-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Course Management</h1>
            <p className="text-blue-100 text-sm mt-1">Create and manage courses, categories, and course content.</p>
          </div>
          <div className="flex gap-3">
            <Button className="h-11 px-5 bg-white/20 hover:bg-white/30 text-white border border-white/30" onClick={openCreateCat}>
              <Plus className="w-4 h-4 mr-2" /> New Category
            </Button>
            <Button className="h-11 px-5 bg-white text-slate-900 hover:bg-slate-100" onClick={openCreateCourse}>
              <Plus className="w-4 h-4 mr-2" /> New Course
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([["courses", "Courses", courses.length], ["categories", "Categories", categories.length]] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === key ? "bg-[#000080] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#000080]" /></div>
      ) : activeTab === "courses" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.length === 0 ? (
            <p className="text-slate-500 col-span-3 text-center py-12">No courses found. Click "New Course" to create one.</p>
          ) : filteredCourses.map(course => {
            const catName = categories.find(c => c.id === course.category)?.name || "Unknown";
            return (
              <Card key={course.id} className="border-t-4 border-t-[#000080] hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{course.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ml-2 shrink-0 ${course.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {course.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Category: <span className="font-medium text-slate-700">{catName}</span></p>
                  <p className="text-sm text-slate-500 mb-3">Price: <span className="font-bold text-[#000080]">₹{course.price}</span></p>
                  <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditCourse(course)}>
                      <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                      onClick={() => deleteCourse(course.id)}
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="border-b bg-slate-50">
                <tr className="text-slate-500">
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCats.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-slate-400">No categories found.</td></tr>
                ) : filteredCats.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{cat.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => openEditCat(cat)}><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => deleteCat(cat.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Course Dialog */}
      <Dialog open={courseDialog.open} onOpenChange={open => !open && setCourseDialog(p => ({ ...p, open: false }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{courseDialog.mode === "create" ? "Create New Course" : "Edit Course"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Course Title *</Label>
              <Input placeholder="e.g. Full Stack Web Development" value={courseDialog.data.title}
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))} />
            </div>
            <div className="space-y-1">
              <Label>Category *</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                value={courseDialog.data.category}
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              >
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Price (₹) *</Label>
              <Input type="number" placeholder="0.00" value={courseDialog.data.price}
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, price: e.target.value } }))} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none"
                placeholder="Brief description of the course..."
                value={courseDialog.data.description}
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Active</Label>
              <button
                type="button"
                onClick={() => setCourseDialog(p => ({ ...p, data: { ...p.data, is_active: !p.data.is_active } }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${courseDialog.data.is_active ? "bg-green-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${courseDialog.data.is_active ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setCourseDialog(p => ({ ...p, open: false }))} disabled={saving}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button className="bg-[#000080] hover:bg-[#000060]" onClick={saveCourse} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                {courseDialog.mode === "create" ? "Create Course" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={catDialog.open} onOpenChange={open => !open && setCatDialog(p => ({ ...p, open: false }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{catDialog.mode === "create" ? "Create Category" : "Edit Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input placeholder="e.g. Web Development" value={catDialog.data.name}
                onChange={e => setCatDialog(p => ({ ...p, data: { ...p.data, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") } }))} />
            </div>
            <div className="space-y-1">
              <Label>Slug (auto-generated)</Label>
              <Input placeholder="web-development" value={catDialog.data.slug}
                onChange={e => setCatDialog(p => ({ ...p, data: { ...p.data, slug: e.target.value } }))} />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Active</Label>
              <button
                type="button"
                onClick={() => setCatDialog(p => ({ ...p, data: { ...p.data, is_active: !p.data.is_active } }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${catDialog.data.is_active ? "bg-green-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${catDialog.data.is_active ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" onClick={() => setCatDialog(p => ({ ...p, open: false }))} disabled={saving}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button className="bg-[#000080] hover:bg-[#000060]" onClick={saveCat} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                {catDialog.mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminCourses;
