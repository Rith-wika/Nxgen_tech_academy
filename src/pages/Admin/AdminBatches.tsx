import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Users, UserCheck, Plus, UsersRound, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { batchService } from "@/services/batchService";
import { courseService } from "@/services/courseService";
import { instructorService } from "@/services/instructorService";
import { enrollmentService } from "@/services/enrollmentService";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Batches", icon: UsersRound, path: "/admin/batches" },
  // { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminBatches = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: "", // id
    instructor: "", // id
  });

  const [studentSearch, setStudentSearch] = useState("");

  const filteredInstructors = useMemo(() => {
    if (!formData.course) return [];
    return instructors.filter((i: any) => 
      i.courses?.some((c: any) => String(c.id) === String(formData.course))
    );
  }, [instructors, formData.course]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [batchesRes, coursesRes, instructorsRes, enrollRes] = await Promise.all([
        batchService.getAllBatches(),
        courseService.getAllCourses(),
        instructorService.getAllInstructors(),
        enrollmentService.getAllEnrollments()
      ]);
      setBatches(batchesRes);
      setCourses(coursesRes);
      setInstructors(instructorsRes);
      setEnrollments(Array.isArray(enrollRes) ? enrollRes : enrollRes.results || []);
    } catch (err) {
      toast.error("Failed to load dependency data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    const data = await batchService.getAllBatches();
    setBatches(data);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.course) {
      toast.error("Name and Course are required.");
      return;
    }
    try {
      await batchService.createBatch({
        name: formData.name,
        description: formData.description,
        course: Number(formData.course),
        instructor: formData.instructor ? Number(formData.instructor) : undefined,
      });
      toast.success("Batch created successfully");
      setIsAddOpen(false);
      setFormData({ name: "", description: "", course: "", instructor: "" });
      loadBatches();
    } catch (error) {
      toast.error("Error creating batch");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this batch?")) return;
    try {
      await batchService.deleteBatch(id);
      toast.success("Batch deleted");
      loadBatches();
    } catch (error) {
      toast.error("Failed to delete batch");
      console.error(error);
    }
  };

  const handleStudentAction = async (email: string, action: 'add' | 'remove') => {
    if (!selectedBatch) return;
    try {
      await batchService.manageStudents(selectedBatch.id, [email], action);
      toast.success(`Student ${action === 'add' ? 'added' : 'removed'} successfully`);
      loadBatches();
      
      // Update selectedBatch state to reflect change immediately inside modal
      setSelectedBatch(prev => {
        if(!prev) return;
        const students = Array.isArray(prev.students) ? [...prev.students] : [];
        const detail = Array.isArray(prev.students_detail) ? [...prev.students_detail] : [];

        if (action === 'add') {
           students.push(email);
           detail.push({ id: Date.now(), email, name: email });
        } else {
           const sIdx = students.indexOf(email);
           if(sIdx !== -1) students.splice(sIdx, 1);
           
           const dIdx = detail.findIndex((s:any) => s.email === email);
           if(dIdx !== -1) detail.splice(dIdx, 1);
        }
        return { ...prev, students, students_detail: detail };
      });

    } catch (err) {
      toast.error("Failed to update student in batch");
      console.error(err);
    }
  };

  // Filter enrollments suitable to be added to the selected course
  // We match enrollment data course name with the selected batch's course title
  const filteredEnrollmentsByCourse = useMemo(() => {
    if (!selectedBatch) return [];
    
    // Some enrollments might use string for course, some might use ID.
    // Let's compare ID if available.
    return enrollments.filter(e => {
      const matchCourse = String(e.course) === String(selectedBatch.course);
      
      const matchSearch = 
        e.name?.toLowerCase().includes(studentSearch.toLowerCase()) || 
        e.email?.toLowerCase().includes(studentSearch.toLowerCase());
        
      return matchCourse && matchSearch && e.email;
    });
  }, [enrollments, selectedBatch, studentSearch]);

  return (
    <DashboardLayout role="admin" sidebarItems={sidebarItems} title="Manage Batches">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#000080] hover:bg-[#000060]">
              <Plus className="w-4 h-4 mr-2" /> Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Batch Name</Label>
                <Input
                  placeholder="e.g. Python Summer Intake"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Select a Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Instructor (assigned to selected course)</Label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  disabled={!formData.course}
                >
                  <option value="">{formData.course ? "Select an Instructor" : "Select a Course First"}</option>
                  {filteredInstructors.map((i: any) => (
                    <option key={i.id} value={i.id}>{i.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={handleCreate} className="bg-[#000080] hover:bg-[#000060]">Create Batch</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-gray-500">No batches created yet.</p>
        ) : (
          batches.map((batch) => (
            <Card key={batch.id} className="border-t-4 border-t-[#000080]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{batch.name}</CardTitle>
                <CardDescription>
                  Course: {courses.find(c => String(c.id) === String(batch.course))?.title || "Unknown Course"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Students: {(batch.students || []).length}</span>
                    <span>Instructor: {instructors.find(i => String(i.id) === String(batch.instructor))?.full_name || 'Unassigned'}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Dialog open={isManageStudentsOpen && selectedBatch?.id === batch.id} onOpenChange={(open) => {
                      setIsManageStudentsOpen(open);
                      if (open) setSelectedBatch(batch);
                      else {
                        setSelectedBatch(null);
                        loadBatches();
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">Manage Students</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Students for {batch.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <Input 
                            placeholder="Filter enrollments by email or name..." 
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                          />
                          <div className="max-h-96 overflow-y-auto rounded-md border">
                            {filteredEnrollmentsByCourse.length === 0 ? (
                               <p className="p-4 text-center text-gray-500 text-sm">No enrollments match this batch's course.</p>
                            ) : (
                              filteredEnrollmentsByCourse.map((enrollment) => {
                                // Check both IDs and emails for safety
                                const isAdded = (selectedBatch?.students_detail || []).some((s:any) => s.email === enrollment.email);
                                return (
                                  <div key={enrollment.email} className="flex justify-between items-center p-3 border-b hover:bg-slate-50">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{enrollment.name}</span>
                                      <span className="text-xs text-gray-500">{enrollment.email} &bull; {enrollment.course}</span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant={isAdded ? "destructive" : "secondary"}
                                      onClick={() => handleStudentAction(enrollment.email, isAdded ? 'remove' : 'add')}
                                    >
                                      {isAdded ? "Remove" : "Add to Batch"}
                                    </Button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(batch.id)}>
                      Delete Batch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminBatches;
