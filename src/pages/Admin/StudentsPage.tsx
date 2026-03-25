import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Settings, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EnrollmentForm from "@/components/EnrollmentForm";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const StudentsPage = () => {
    const [search, setSearch] = useState("");
    const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const data = await enrollmentService.getAllEnrollments();
            // Assuming the API returns a list or an object with results
            setEnrollments(Array.isArray(data) ? data : data.results || []);
        } catch (error: any) {
            toast.error("Failed to fetch student enrollments.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEnrollments = enrollments.filter((e) =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        String(e.course).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Student Enrollments</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#000080] hover:bg-[#000060]">
                            <Plus className="w-4 h-4 mr-2" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Add New Student Enrollment</DialogTitle>
                        </DialogHeader>
                        <EnrollmentForm
                            onSuccess={() => {
                                setIsAddDialogOpen(false);
                                fetchEnrollments();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
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
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b">
                                <tr className="text-gray-500 text-sm">
                                    <th className="pb-4 font-semibold">Name</th>
                                    <th className="pb-4 font-semibold">Email</th>
                                    <th className="pb-4 font-semibold">Phone</th>
                                    <th className="pb-4 font-semibold">Course</th>
                                    <th className="pb-4 font-semibold">Type/Mode</th>
                                    <th className="pb-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-400">Loading enrollments...</td>
                                    </tr>
                                ) : filteredEnrollments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-400">No enrollments found.</td>
                                    </tr>
                                ) : filteredEnrollments.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-semibold text-gray-800">{student.name}</td>
                                        <td className="py-4 text-gray-600">{student.email}</td>
                                        <td className="py-4 text-gray-600">{student.phone}</td>
                                        <td className="py-4 text-gray-600">{student.course}</td>
                                        <td className="py-4">
                                            <div className="flex flex-col text-xs">
                                                <span className="font-bold text-blue-700">{student.course_type}</span>
                                                <span className="text-gray-500">{student.preferred_mode}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default StudentsPage;
