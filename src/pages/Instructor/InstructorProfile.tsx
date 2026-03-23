import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Upload, Users, User, Edit2, Save, X, Phone, Mail, BadgeCheck, Landmark, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { instructorService } from "@/services/instructorService";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
    { label: "Upload Lessons", icon: Upload, path: "/instructor/upload-lesson" },
    { label: "Students", icon: Users, path: "/instructor/students" },
    { label: "Profile", icon: User, path: "/instructor/profile" },
];

const InstructorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [editedProfile, setEditedProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await instructorService.getProfile();
                setProfile(data);
                setEditedProfile(data);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            await instructorService.updateProfile(editedProfile);
            setProfile(editedProfile);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Instructor Profile">
            <div className="max-w-5xl mx-auto space-y-6 pb-10">
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#000080] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            {profile?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
                            <p className="text-gray-500">{profile?.employee_id} • Joined on {profile?.date_of_joining}</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="bg-[#000080] hover:bg-[#000060]">
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Contact & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-none shadow-sm h-full">
                            <CardHeader className="bg-gray-50/50 border-b">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#000080]" /> Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Email</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.email} onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })} />
                                    ) : (
                                        <p className="flex items-center gap-2 font-medium text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> {profile?.email}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Phone</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.phone} onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })} />
                                    ) : (
                                        <p className="flex items-center gap-2 font-medium text-gray-700"><Phone className="w-4 h-4 text-gray-400" /> {profile?.phone}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Qualification</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.qualification} onChange={(e) => setEditedProfile({ ...editedProfile, qualification: e.target.value })} />
                                    ) : (
                                        <p className="flex items-center gap-2 font-medium text-gray-700"><BadgeCheck className="w-4 h-4 text-gray-400" /> {profile?.qualification}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Experience</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.experience} onChange={(e) => setEditedProfile({ ...editedProfile, experience: e.target.value })} />
                                    ) : (
                                        <p className="flex items-center gap-2 font-medium text-gray-700"><FileText className="w-4 h-4 text-gray-400" /> {profile?.experience}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Bank & Identity + Courses */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Landmark className="w-4 h-4 text-[#000080]" /> Bank & Identity Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Aadhaar Number</Label>
                                    <p className="font-semibold text-gray-800 tracking-wider">
                                        {profile?.aadhaar_number?.replace(/\d(?=\d{4})/g, "•")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">PAN Number</Label>
                                    <p className="font-semibold text-gray-800 tracking-wider uppercase">{profile?.pan_number}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Account Number</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.bank_account_number} onChange={(e) => setEditedProfile({ ...editedProfile, bank_account_number: e.target.value })} />
                                    ) : (
                                        <p className="font-medium text-gray-800">{profile?.bank_account_number}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">IFSC Code</Label>
                                    {isEditing ? (
                                        <Input value={editedProfile?.ifsc_code} onChange={(e) => setEditedProfile({ ...editedProfile, ifsc_code: e.target.value })} />
                                    ) : (
                                        <p className="font-medium text-gray-800 uppercase">{profile?.ifsc_code}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader className="bg-gray-50/50 border-b">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#000080]" /> Assigned Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    {profile?.assigned_courses_names?.map((course: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                                            {course}
                                        </span>
                                    )) || <p className="text-gray-400 text-sm italic">No courses assigned yet</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {profile?.document_url && (
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#000080]" /> Identity Document
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <a
                                        href={profile.document_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                        View Uploaded Document
                                    </a>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstructorProfile;
