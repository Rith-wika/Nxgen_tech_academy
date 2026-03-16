import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Settings, Plus, Search, Edit2, Trash2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const InstructorsPage = () => {
    const [search, setSearch] = useState("");

    const instructors = [
        { id: "INS001", name: "Dr. Arun Kumar", email: "arun@example.com", courses: 3, status: "Active" },
        { id: "INS002", name: "Sarah Williams", email: "sarah@example.com", courses: 2, status: "Active" },
        { id: "INS003", name: "Satish Rao", email: "satish@example.com", courses: 1, status: "On Leave" },
    ];

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Instructors</h1>
                <Button className="bg-[#000080] hover:bg-[#000060]">
                    <Plus className="w-4 h-4 mr-2" /> Add Instructor
                </Button>
            </div>

            <Card>
                <CardHeader>
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
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b">
                                <tr className="text-gray-500 text-sm">
                                    <th className="pb-4 font-semibold">ID</th>
                                    <th className="pb-4 font-semibold">Name</th>
                                    <th className="pb-4 font-semibold">Email</th>
                                    <th className="pb-4 font-semibold">Courses Assigned</th>
                                    <th className="pb-4 font-semibold">Status</th>
                                    <th className="pb-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {instructors.map((instructor) => (
                                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-medium">{instructor.id}</td>
                                        <td className="py-4 font-semibold text-indigo-900">{instructor.name}</td>
                                        <td className="py-4 text-gray-600">{instructor.email}</td>
                                        <td className="py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                {instructor.courses} Courses
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${instructor.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                                }`}>
                                                {instructor.status}
                                            </span>
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

export default InstructorsPage;
