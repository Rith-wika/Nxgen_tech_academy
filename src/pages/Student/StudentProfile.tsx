import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Loader2, FileText } from "lucide-react";
import { studentSidebarItems } from "./studentSidebarItems";
import axiosInstance from "@/api/axiosInstance";

const StudentProfile = () => {
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        location: "",
        bio: ""
    });
    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get("/api/auth/profile/");
                if (response.data) {
                    setProfile({
                        first_name: response.data.first_name || "",
                        last_name: response.data.last_name || "",
                        email: response.data.email || "",
                        phone: response.data.student_profile?.phone || "",
                        location: response.data.student_profile?.location || "",
                        bio: response.data.student_profile?.bio || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setMessage({ type: "error", text: "Failed to load profile data." });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const fullName = `${profile.first_name} ${profile.last_name}`.trim() || "Student User";

    return (
        <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="My Profile">
            <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-xl px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <span className="text-xs font-bold uppercase tracking-wide text-[#000080] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                    Read Only
                </span>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 shadow-sm h-fit">
                        <CardHeader className="text-center flex flex-col items-center">
                            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <CardTitle className="text-xl font-bold">{fullName}</CardTitle>
                            <CardDescription>{profile.email}</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your details are currently view-only.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {message.text && (
                                <div className={`p-3 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message.text}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 mt-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <label className="text-xs font-semibold text-gray-500 uppercase block">First Name</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> {profile.first_name || "Not provided"}</p>
                                </div>

                                <div className="space-y-1 mt-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <label className="text-xs font-semibold text-gray-500 uppercase block">Last Name</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> {profile.last_name || "Not provided"}</p>
                                </div>
                                
                                <div className="space-y-1 mt-2 md:col-span-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <label className="text-xs font-semibold text-gray-500 uppercase block">Email Address</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {profile.email || "Not provided"}</p>
                                </div>
                                
                                <div className="space-y-1 mt-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <label className="text-xs font-semibold text-gray-500 uppercase block">Phone Number</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {profile.phone || "Not provided"}</p>
                                </div>

                                <div className="space-y-1 mt-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                    <label className="text-xs font-semibold text-gray-500 uppercase block">Location</label>
                                    <p className="text-gray-800 font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {profile.location || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="space-y-1 mt-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                                <label className="text-xs font-semibold text-gray-500 uppercase block">Bio</label>
                                <p className="text-gray-800 font-medium flex items-start gap-2"><FileText className="h-4 w-4 text-gray-400 mt-1" /> {profile.bio || "No bio available"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentProfile;
