import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Users, User, FileText, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/instructor/courses" },
  { label: "Students", icon: Users, path: "/instructor/students" },
  { label: "Assignments", icon: FileText, path: "/instructor/assignments" },
  { label: "Profile", icon: User, path: "/instructor/profile" },
];

const InstructorAssignments = () => {
  return (
    <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Assignments">
      <div className="max-w-4xl mx-auto py-10">
        <Card className="border-l-4 border-l-[#000080]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
              <Clock3 className="w-6 h-6 text-[#000080]" />
              Assignments Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              The assignments workspace is planned for the next update. You will be able to track submissions,
              review files, and monitor student progress here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAssignments;
