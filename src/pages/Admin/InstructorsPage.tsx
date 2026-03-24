import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Settings, Plus, Search, Edit2, Trash2, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { instructorService } from "@/services/instructorService";
import { toast } from "sonner";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const InstructorsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [instructorList, setInstructorList] = useState<any[]>([]);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const data = await instructorService.getAllInstructors();
            // Handle both direct array and paginated response
            const list = Array.isArray(data) ? data : (data.results || []);
            setInstructorList(list);
        } catch (error) {
            toast.error("Failed to load instructors.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInstructors = instructorList.filter(ins =>
        (ins.full_name || ins.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (ins.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (ins.employee_id || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Instructors</h1>
                <div className="flex gap-4">
                    <Button
                        className="bg-[#000080] hover:bg-[#000060]"
                        onClick={() => navigate('/admin/instructors/add')}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Instructor
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search instructors..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b">
                                    <tr className="text-gray-500 text-sm">
                                        <th className="pb-4 font-semibold">Employee ID</th>
                                        <th className="pb-4 font-semibold">Name</th>
                                        <th className="pb-4 font-semibold">Email</th>
                                        <th className="pb-4 font-semibold">Phone</th>
                                        <th className="pb-4 font-semibold">Status</th>
                                        <th className="pb-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredInstructors.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                                No instructors found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInstructors.map((instructor) => (
                                            <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-medium">{instructor.employee_id || "N/A"}</td>
                                                <td className="py-4 font-semibold text-indigo-900">{instructor.full_name || instructor.name}</td>
                                                <td className="py-4 text-gray-600">{instructor.email}</td>
                                                <td className="py-4 text-gray-600">{instructor.phone || "N/A"}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${instructor.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {instructor.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
        </DashboardLayout>
    );
};

export default InstructorsPage;
