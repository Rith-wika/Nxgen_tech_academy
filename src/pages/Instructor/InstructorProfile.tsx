import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Users, User, Phone, Mail, BadgeCheck, Landmark, FileText, Loader2, Lock } from "lucide-react";
import { instructorSidebarItems } from "./instructorSidebarItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { instructorService } from "@/services/instructorService";

const sidebarItems = instructorSidebarItems;

const InstructorProfile = () => {
    interface InstructorProfileData {
        name?: string;
        employee_id?: string;
        date_of_joining?: string;
        email?: string;
        phone?: string;
        qualification?: string;
        experience?: string;
        aadhaar_number?: string;
        pan_number?: string;
        bank_account_number?: string;
        ifsc_code?: string;
        assigned_courses_names?: string[];
        document_url?: string;
    }

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<InstructorProfileData | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await instructorService.getProfile();
                setProfile(data);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Instructor Profile">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                </div>
            </DashboardLayout>
        );
    }

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
                    <span className="text-xs font-bold uppercase tracking-wide text-[#000080] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                        Read Only
                    </span>
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
                                    <p className="flex items-center gap-2 font-medium text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> {profile?.email || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Phone</Label>
                                    <p className="flex items-center gap-2 font-medium text-gray-700"><Phone className="w-4 h-4 text-gray-400" /> {profile?.phone || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Qualification</Label>
                                    <p className="flex items-center gap-2 font-medium text-gray-700"><BadgeCheck className="w-4 h-4 text-gray-400" /> {profile?.qualification || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Experience</Label>
                                    <p className="flex items-center gap-2 font-medium text-gray-700"><FileText className="w-4 h-4 text-gray-400" /> {profile?.experience || "Not provided"}</p>
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
                                        {profile?.aadhaar_number ? profile.aadhaar_number.replace(/\d(?=\d{4})/g, "•") : "Not provided"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">PAN Number</Label>
                                    <p className="font-semibold text-gray-800 tracking-wider uppercase">{profile?.pan_number || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">Account Number</Label>
                                    <p className="font-medium text-gray-800">{profile?.bank_account_number || "Not provided"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-400 uppercase">IFSC Code</Label>
                                    <p className="font-medium text-gray-800 uppercase">{profile?.ifsc_code || "Not provided"}</p>
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
