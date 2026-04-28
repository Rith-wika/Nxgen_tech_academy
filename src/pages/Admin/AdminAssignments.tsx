import React from 'react';
import AssignmentsManager from '@/components/AssignmentsManager';
import { LayoutDashboard, Users, UserCheck, BookOpen, UsersRound, FileText } from 'lucide-react';

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Batches", icon: UsersRound, path: "/admin/batches" },
  { label: "Assignments", icon: FileText, path: "/admin/assignments" },
];

const AdminAssignments = () => {
  return <AssignmentsManager role="admin" sidebarItems={sidebarItems} />;
};

export default AdminAssignments;
