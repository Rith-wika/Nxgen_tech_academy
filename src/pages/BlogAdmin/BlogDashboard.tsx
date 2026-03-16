import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, FileText, PlusCircle } from "lucide-react";
import BlogList from "./BlogList";
import CreateBlog from "./CreateBlog";
import EditBlog from "./EditBlog";

const BlogDashboard = () => {
    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/blog-admin/dashboard" },
        { label: "My Blogs", icon: FileText, path: "/blog-admin/blogs" },
        { label: "Create Blog", icon: PlusCircle, path: "/blog-admin/create-blog" },
    ];

    return (
        <DashboardLayout role="blog_admin" sidebarItems={sidebarItems} title="Blog Manager">
            <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="dashboard" element={<BlogList />} />
                <Route path="blogs" element={<BlogList />} />
                <Route path="create-blog" element={<CreateBlog />} />
                <Route path="edit/:id" element={<EditBlog />} />
            </Routes>
        </DashboardLayout>
    );
};

export default BlogDashboard;
