import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, UserCheck, Settings, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const StudentsPage = () => {
    const [search, setSearch] = useState("");

    const students = [
        { id: "STU001", name: "John Doe", email: "john@example.com", course: "SAP ABAP", status: "Active" },
        { id: "STU002", name: "Jane Smith", email: "jane@example.com", course: "SAP BTP", status: "Inactive" },
        { id: "STU003", name: "Mike Johnson", email: "mike@example.com", course: "Python Full Stack", status: "Active" },
    ];

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
                <Button className="bg-[#000080] hover:bg-[#000060]">
                    <Plus className="w-4 h-4 mr-2" /> Add Student
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search students..."
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
                                    <th className="pb-4 font-semibold">Course</th>
                                    <th className="pb-4 font-semibold">Status</th>
                                    <th className="pb-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-medium">{student.id}</td>
                                        <td className="py-4 font-semibold">{student.name}</td>
                                        <td className="py-4 text-gray-600">{student.email}</td>
                                        <td className="py-4 text-gray-600">{student.course}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {student.status}
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

export default StudentsPage;
