import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    UsersRound,
    UserCheck,
    FileText,
    Target,
    BarChart3,
    Calendar,
    Phone,
    Plus,
    Upload,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminSidebarItems } from "./adminSidebarItems";
import { campaignService, Campaign } from "@/services/campaignService";
import { leadService } from "@/services/leadService";
import { courseService } from "@/services/courseService";
import { enrollService, LeadEnrollmentData } from "@/services/enrollService";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Search } from "lucide-react";
import { instructorService } from "@/services/instructorService";
import { demoService } from "@/services/demoService";
import DemoDetailsDialog from "./components/DemoDetailsDialog";
import ScheduleDemoDialog from "./components/ScheduleDemoDialog";
import { AddLeadDialog, EditLeadDialog, DeleteLeadDialog } from "./components/LeadDialogs";
import { AddCampaignDialog, EditCampaignDialog, DeleteCampaignDialog } from "./components/CampaignDialogs";

const initialDemos = [
    {
        id: 1,
        campaign: "Demo Campaign",
        instructor: "Jane Doe",
        date: "2026-05-10",
        time: "10:00 AM",
        status: "Scheduled",
        link: "https://zoom.us/j/123456789",
        participants: [
            { id: 101, name: "John Smith", attended: false },
            { id: 102, name: "Alice Johnson", attended: false },
            { id: 103, name: "Bob Brown", attended: false },
        ]
    },
];

const Preface = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [campaignDetailTab, setCampaignDetailTab] = useState("leads");


    // State for lists
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [campaignStatuses, setCampaignStatuses] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [instructors, setInstructors] = useState<any[]>([]);

    const [leads, setLeads] = useState<any[]>([]);
    const [leadStatuses, setLeadStatuses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
    const [enrollForm, setEnrollForm] = useState<LeadEnrollmentData>({
        lead: "",
        course: "",
        enrollment_date: "",
        fee_status: "Pending",
        status: "pending",
        notes: "",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCampaigns();
        fetchStatuses();
        fetchLeads();
        fetchLeadStatuses();
        fetchInstructors();
        fetchDemos();
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCampaign) {
            fetchEnrollments(selectedCampaign.id);
        } else {
            setEnrollments([]);
        }
    }, [selectedCampaign]);

    const fetchDemos = async () => {
        try {
            const data: any = await demoService.getAllDemos();
            const rawDemos = Array.isArray(data) ? data : (data.results || []);
            const mappedDemos = rawDemos.map((d: any) => {
                if (d.scheduled_at) {
                    const parts = d.scheduled_at.split(' ');
                    return {
                        ...d,
                        date: parts[0],
                        time: parts[1],
                        status: d.status || "Scheduled"
                    };
                }
                return { ...d, status: d.status || "Scheduled" };
            });
            setDemos(mappedDemos);
        } catch (error) {
            console.error("Failed to load demos", error);
            toast.error("Failed to load demos.");
        }
    };

    const fetchInstructors = async () => {
        try {
            const data: any = await instructorService.getAllInstructors();
            setInstructors(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error("Failed to load instructors", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const data: any = await courseService.getAllCourses();
            const normalized = Array.isArray(data) ? data : (data.results || []);
            setCourses(normalized.map((course: any) => ({ id: course.id, title: course.title || course.name || "Untitled Course" })));
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const fetchEnrollments = async (campaignId?: number | string) => {
        setEnrollLoading(true);
        try {
            const data: any = await enrollService.getEnrollments(campaignId);
            setEnrollments(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error("Failed to load enrollments", error);
            toast.error("Failed to load enrollments.");
        } finally {
            setEnrollLoading(false);
        }
    };

    const fetchLeadStatuses = async () => {
        try {
            const data = await leadService.getStatuses();
            setLeadStatuses(data);
        } catch (error) {
            console.error("Failed to load lead statuses", error);
        }
    };

    const fetchLeads = async () => {
        try {
            const data = await leadService.getAllLeads();
            setLeads(data);
        } catch (error) {
            console.error("Failed to load leads", error);
            toast.error("Failed to load leads.");
        }
    };

    const fetchStatuses = async () => {
        try {
            const data = await campaignService.getStatuses();
            setCampaignStatuses(data);
        } catch (error) {
            console.error("Failed to load statuses", error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignService.getAllCampaigns();
            setCampaigns(data);
        } catch (error) {
            toast.error("Failed to load campaigns.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [demos, setDemos] = useState<any[]>([]);

    // Form state
    const [newCampaign, setNewCampaign] = useState({ name: "", startDate: "", endDate: "", desc: "", status: "active" });
    const [newLead, setNewLead] = useState({ fullname: "", email: "", phone_number: "", campaign: "", status: "New" });
    const [newDemo, setNewDemo] = useState({ instructor: "", date: "", time: "", link: "" });
    const [selectedDemo, setSelectedDemo] = useState<any>(null);
    const [reschedulingParticipants, setReschedulingParticipants] = useState<any[]>([]);

    const campaignDemos = selectedCampaign
        ? demos.filter(d =>
            d.campaign === selectedCampaign.name ||
            d.campaign === selectedCampaign.id ||
            d.campaign === String(selectedCampaign.id)
        )
        : demos;

    // Dialog open states
    const [campaignOpen, setCampaignOpen] = useState(false);
    const [leadOpen, setLeadOpen] = useState(false);
    const [editLeadOpen, setEditLeadOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [deleteLeadOpen, setDeleteLeadOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<any>(null);
    const [demoOpen, setDemoOpen] = useState(false);
    const [demoDetailsOpen, setDemoDetailsOpen] = useState(false);
    const [enrollOpen, setEnrollOpen] = useState(false);
    const [editCampaignOpen, setEditCampaignOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [deleteCampaignOpen, setDeleteCampaignOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<any>(null);

    const handleDeleteCampaign = async () => {
        if (!campaignToDelete) return;
        try {
            await campaignService.deleteCampaign(campaignToDelete.id);
            toast.success("Campaign deleted successfully!");
            setDeleteCampaignOpen(false);
            setCampaignToDelete(null);
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to delete campaign.");
            console.error(error);
        }
    };

    const handleEditCampaignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await campaignService.updateCampaign(editingCampaign.id, {
                name: editingCampaign.name,
                start_date: editingCampaign.startDate,
                end_date: editingCampaign.endDate,
                description: editingCampaign.desc,
                status: editingCampaign.status
            });
            toast.success("Campaign updated successfully!");
            setEditCampaignOpen(false);
            setEditingCampaign(null);
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to update campaign.");
            console.error(error);
        }
    };

    const openEditCampaign = async (campaign: any) => {
        try {
            const data = await campaignService.getCampaign(campaign.id);
            setEditingCampaign({
                id: campaign.id,
                name: data.name || "",
                startDate: data.start_date || "",
                endDate: data.end_date || "",
                desc: data.description || "",
                status: data.status || "active"
            });
            setEditCampaignOpen(true);
        } catch (error) {
            toast.error("Failed to fetch campaign details.");
            console.error(error);
        }
    };

    const handleAddCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await campaignService.createCampaign({
                name: newCampaign.name,
                start_date: newCampaign.startDate,
                end_date: newCampaign.endDate,
                description: newCampaign.desc,
                status: newCampaign.status
            });
            toast.success("Campaign created successfully!");
            setNewCampaign({ name: "", startDate: "", endDate: "", desc: "", status: "Active" });
            setCampaignOpen(false);
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to create campaign.");
            console.error(error);
        }
    };

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await leadService.createLead({
                fullname: newLead.fullname,
                email: newLead.email,
                phone_number: newLead.phone_number,
                campaign: newLead.campaign,
                status: newLead.status || "New"
            });
            toast.success("Lead created successfully!");
            setNewLead({ fullname: "", email: "", phone_number: "", campaign: "", status: "New" });
            setLeadOpen(false);
            fetchLeads();
        } catch (error) {
            toast.error("Failed to create lead.");
            console.error(error);
        }
    };

    const handleEditLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await leadService.updateLead(editingLead.id, {
                fullname: editingLead.fullname,
                email: editingLead.email,
                phone_number: editingLead.phone_number,
                campaign: editingLead.campaign,
                status: editingLead.status
            });
            toast.success("Lead updated successfully!");
            setEditLeadOpen(false);
            setEditingLead(null);
            fetchLeads();
        } catch (error) {
            toast.error("Failed to update lead.");
            console.error(error);
        }
    };

    const openEditLead = async (lead: any) => {
        try {
            const data = await leadService.getLead(lead.id);
            setEditingLead({
                id: data.id,
                fullname: data.fullname || data.name || "",
                email: data.email || "",
                phone_number: data.phone_number || data.phone || "",
                campaign: data.campaign || "",
                status: data.status || ""
            });
            setEditLeadOpen(true);
        } catch (error) {
            toast.error("Failed to fetch lead details.");
            console.error(error);
        }
    };

    const handleDeleteLead = async () => {
        if (!leadToDelete) return;
        try {
            await leadService.deleteLead(leadToDelete.id);
            toast.success("Lead deleted successfully!");
            setDeleteLeadOpen(false);
            setLeadToDelete(null);
            fetchLeads();
        } catch (error) {
            toast.error("Failed to delete lead.");
            console.error(error);
        }
    };

    const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await leadService.bulkImport(formData);
            toast.success("Leads imported successfully!");
            fetchLeads();
        } catch (error) {
            toast.error("Failed to import leads.");
            console.error(error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleScheduleDemo = async (e: React.FormEvent) => {
        e.preventDefault();

        const isReschedule = reschedulingParticipants.length > 0;
        let participants = [];
        if (isReschedule) {
            participants = reschedulingParticipants.map(p => ({ ...p, attended: false }));
        } else {
            // Get leads for this campaign to auto-assign as participants
            const campaignLeads = leads.filter(l => l.campaign == selectedCampaign?.id || l.campaign_name === selectedCampaign?.name || l.campaign === selectedCampaign?.name);
            participants = campaignLeads.map(l => ({ id: l.id, name: l.fullname || l.name, attended: false }));
        }

        const demoData = {
            campaign: selectedCampaign?.name,
            instructor: newDemo.instructor,
            date: newDemo.date,
            time: newDemo.time,
            scheduled_at: `${newDemo.date} ${newDemo.time}:00`,
            status: "Scheduled",
            link: newDemo.link,
            participants: participants
        };

        try {
            if (isReschedule && selectedDemo) {
                await demoService.rescheduleDemo(selectedDemo.id, demoData);
                setReschedulingParticipants([]); // Clear after use
                toast.success("Demo rescheduled successfully!");
            } else {
                await demoService.scheduleDemo(demoData);
                toast.success("Demo scheduled successfully!");
            }
            setNewDemo({ instructor: "", date: "", time: "", link: "" });
            setDemoOpen(false);
            fetchDemos();
        } catch (error) {
            toast.error(isReschedule ? "Failed to reschedule demo." : "Failed to schedule demo.");
            console.error(error);
        }
    };

    const handleSaveAttendance = async (demoId: number, updatedParticipants: any[]) => {
        try {
            await demoService.postAttendance(demoId, {
                attendance: updatedParticipants
            });
            toast.success("Attendance saved successfully!");
            fetchDemos();
        } catch (error) {
            toast.error("Failed to save attendance.");
            console.error(error);
        }
    };

    const handleDeleteDemo = async (demoId: number) => {
        try {
            await demoService.deleteDemo(demoId);
            toast.success("Demo deleted successfully!");
            fetchDemos();
        } catch (error) {
            toast.error("Failed to delete demo.");
            console.error(error);
        }
    };

    const handleReschedule = (demoId: number, absentParticipants: any[]) => {
        const demoToReschedule = demos.find(d => d.id === demoId);
        if (!demoToReschedule) return;

        setSelectedDemo(demoToReschedule);
        setReschedulingParticipants(absentParticipants);
        setNewDemo({
            instructor: demoToReschedule.instructor,
            date: "",
            time: "",
            link: demoToReschedule.link
        });
        setDemoOpen(true);
        toast.info(`Scheduling a new demo for ${absentParticipants.length} absent participants.`);
    };

    const handleViewDemo = async (demo: any) => {
        try {
            const [data, leadsData, statusData, rescheduleData] = await Promise.all([
                demoService.getDemo(demo.id),
                demoService.getDemoLeads(demo.id),
                demoService.getDemoStatus(demo.id),
                demoService.getRescheduleDetails(demo.id).catch(() => null)
            ]);

            let mappedData = {
                ...data,
                participants: leadsData,
                status: statusData.status || data.status || "Scheduled",
                rescheduleDetails: rescheduleData
            };
            if (data.scheduled_at) {
                const parts = data.scheduled_at.split(' ');
                mappedData = {
                    ...mappedData,
                    date: parts[0],
                    time: parts[1]
                };
            }
            setSelectedDemo(mappedData);
            setDemoDetailsOpen(true);
        } catch (error) {
            console.error("Failed to fetch demo details", error);
            // Fallback
            try {
                const leadsData = await demoService.getDemoLeads(demo.id);
                setSelectedDemo({ ...demo, participants: leadsData });
            } catch (e) {
                setSelectedDemo(demo);
            }
            setDemoDetailsOpen(true);
        }
    };

    const handleEnrollInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEnrollForm(prev => ({
            ...prev,
            [name]: value,
        } as LeadEnrollmentData));
    };

    const resetEnrollForm = () => {
        setEditingEnrollment(null);
        setEnrollForm({
            lead: "",
            course: "",
            enrollment_date: "",
            fee_status: "Pending",
            status: "pending",
            notes: "",
        });
    };

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!enrollForm.lead || !enrollForm.course || !enrollForm.enrollment_date) {
            toast.error("Please select a lead, course, and date for enrollment.");
            return;
        }

        try {
            if (editingEnrollment) {
                await enrollService.updateEnrollment(editingEnrollment.id, enrollForm);
                toast.success("Enrollment updated successfully.");
            } else {
                await enrollService.createEnrollment(enrollForm);
                toast.success("Enrollment created successfully.");
            }
            setEnrollOpen(false);
            resetEnrollForm();
            if (selectedCampaign) {
                fetchEnrollments(selectedCampaign.id);
            }
        } catch (error) {
            console.error("Enrollment error", error);
            toast.error("Failed to save enrollment. Please try again.");
        }
    };

    const handleEditEnrollment = (enrollment: any) => {
        setEditingEnrollment(enrollment);
        setEnrollForm({
            lead: enrollment.lead,
            course: enrollment.course,
            enrollment_date: enrollment.enrollment_date,
            fee_status: enrollment.fee_status,
            status: enrollment.status,
            notes: enrollment.notes || "",
        });
        setEnrollOpen(true);
    };

    const handleDeleteEnrollment = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
        try {
            await enrollService.deleteEnrollment(id);
            toast.success("Enrollment deleted successfully.");
            if (selectedCampaign) {
                fetchEnrollments(selectedCampaign.id);
            }
        } catch (error) {
            console.error("Failed to delete enrollment", error);
            toast.error("Failed to delete enrollment.");
        }
    };

    return (
        <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
            <div className="rounded-2xl mb-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Preface & Campaign Management</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage all your campaigns, leads, demos, and enrollments in one place.</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            {!selectedCampaign && (
                <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                    {[
                        { id: "overview", label: "Overview", icon: BarChart3 },
                        { id: "campaign", label: "Campaign", icon: Target }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                ? "bg-[#000080] text-white shadow-md scale-105"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Total Campaigns", value: "12", change: "+2 this month", color: "text-purple-600" },
                                { title: "Total Leads", value: "1,240", change: "+145 this month", color: "text-blue-600" },
                                { title: "Scheduled Demos", value: "48", change: "+12 this week", color: "text-orange-600" },
                                { title: "Recent Enrollments", value: "320", change: "+8% conversion", color: "text-green-600" }
                            ].map((stat, idx) => (
                                <Card key={idx} className="hover:shadow-md transition-shadow border-t-4 border-t-[#000080]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                                        <p className="text-xs text-emerald-500 font-semibold mt-1">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Campaigns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {campaigns.map(c => (
                                            <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                                                <div>
                                                    <p className="font-semibold text-slate-800">{c.name}</p>
                                                    <p className="text-xs text-slate-500">{c.leads || 0} leads generated</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{c.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Demos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {demos.map(d => (
                                            <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                                                <div>
                                                    <p className="font-semibold text-slate-800">{d.campaign}</p>
                                                    <p className="text-xs text-slate-500">Instructor: {d.instructor} | {d.date} at {d.time}</p>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    setSelectedDemo(d);
                                                    setDemoDetailsOpen(true);
                                                }}>View</Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* CAMPAIGN TAB */}
                {!selectedCampaign && activeTab === "campaign" && (
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Campaigns</CardTitle>
                                <CardDescription>Manage your marketing campaigns</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search campaigns..."
                                        className="pl-8 bg-white"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={handleBulkImport} />
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Bulk Import</Button>
                                <Button className="bg-[#000080] hover:bg-blue-900" onClick={() => setCampaignOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Campaign
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {campaigns.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                                    <Card key={c.id} className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-[#000080]" onClick={() => setSelectedCampaign(c)}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold text-slate-800">{c.name}</CardTitle>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">{c.status}</span>
                                            </div>
                                            <CardDescription className="text-xs">{c.start_date} to {c.end_date}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-600 line-clamp-2">{c.description}</p>
                                            <div className="flex justify-end gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    setEditingCampaign({
                                                        id: c.id,
                                                        name: c.name,
                                                        startDate: c.start_date,
                                                        endDate: c.end_date,
                                                        desc: c.description,
                                                        status: c.status
                                                    });
                                                    setEditCampaignOpen(true);
                                                }}>Edit</Button>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => {
                                                    setCampaignToDelete(c);
                                                    setDeleteCampaignOpen(true);
                                                }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>

                        <AddCampaignDialog
                            campaignOpen={campaignOpen}
                            setCampaignOpen={setCampaignOpen}
                            newCampaign={newCampaign}
                            setNewCampaign={setNewCampaign}
                            handleAddCampaign={handleAddCampaign}
                            editCampaignOpen={editCampaignOpen}
                            setEditCampaignOpen={setEditCampaignOpen}
                            deleteCampaignOpen={deleteCampaignOpen}
                            setDeleteCampaignOpen={setDeleteCampaignOpen}
                            editingCampaign={editingCampaign}
                            setEditingCampaign={setEditingCampaign}
                            campaignStatuses={campaignStatuses}
                            handleEditCampaignSubmit={handleEditCampaignSubmit}
                            handleDeleteCampaign={handleDeleteCampaign}
                        />

                        <EditCampaignDialog
                            editCampaignOpen={editCampaignOpen}
                            setEditCampaignOpen={setEditCampaignOpen}
                            editingCampaign={editingCampaign}
                            setEditingCampaign={setEditingCampaign}
                            campaignStatuses={campaignStatuses}
                            handleEditCampaignSubmit={handleEditCampaignSubmit}
                            campaignOpen={campaignOpen}
                            setCampaignOpen={setCampaignOpen}
                            deleteCampaignOpen={deleteCampaignOpen}
                            setDeleteCampaignOpen={setDeleteCampaignOpen}
                            newCampaign={newCampaign}
                            setNewCampaign={setNewCampaign}
                            handleAddCampaign={handleAddCampaign}
                            handleDeleteCampaign={handleDeleteCampaign}
                        />

                        <DeleteCampaignDialog
                            deleteCampaignOpen={deleteCampaignOpen}
                            setDeleteCampaignOpen={setDeleteCampaignOpen}
                            handleDeleteCampaign={handleDeleteCampaign}
                            campaignOpen={campaignOpen}
                            setCampaignOpen={setCampaignOpen}
                            editCampaignOpen={editCampaignOpen}
                            setEditCampaignOpen={setEditCampaignOpen}
                            newCampaign={newCampaign}
                            setNewCampaign={setNewCampaign}
                            editingCampaign={editingCampaign}
                            setEditingCampaign={setEditingCampaign}
                            campaignStatuses={campaignStatuses}
                            handleAddCampaign={handleAddCampaign}
                            handleEditCampaignSubmit={handleEditCampaignSubmit}
                        />
                    </Card>
                )}

                {/* CAMPAIGN DETAILS VIEW */}
                {selectedCampaign && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedCampaign(null); setActiveTab("campaign"); }}>
                                &larr; Back to Campaigns
                            </Button>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{selectedCampaign.name}</h2>
                                <p className="text-sm text-slate-500">Manage leads, demos, and enrollments for this campaign</p>
                            </div>
                        </div>

                        {/* Sub Navigation */}
                        <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                            {[
                                { id: "leads", label: "Leads", icon: Users },
                                { id: "demo", label: "Demo", icon: Calendar },
                                { id: "enrollment", label: "Enrollment", icon: CheckCircle2 }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setCampaignDetailTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${campaignDetailTab === tab.id
                                        ? "bg-blue-100 text-blue-800 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* LEADS SECTION */}
                        {campaignDetailTab === "leads" && (
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Campaign Leads</CardTitle>
                                    </div>
                                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                                            onClick={() => {
                                                setDemoOpen(true);
                                            }}
                                        >
                                            <Calendar className="w-4 h-4 mr-2" /> Schedule Demo
                                        </Button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={handleBulkImport} />
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Bulk Import</Button>
                                        <Dialog open={leadOpen} onOpenChange={(open) => {
                                            if (open) {
                                                setNewLead(prev => ({ ...prev, campaign: String(selectedCampaign.id) }));
                                            }
                                            setLeadOpen(open);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-[#000080] hover:bg-blue-900"><Plus className="w-4 h-4 mr-2" /> Add Lead</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Add New Lead</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleAddLead} className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Full Name</label>
                                                        <Input required placeholder="John Doe" value={newLead.fullname} onChange={e => setNewLead({ ...newLead, fullname: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Email</label>
                                                        <Input required type="email" placeholder="john@example.com" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Phone</label>
                                                        <Input required type="tel" placeholder="+1234567890" value={newLead.phone_number} onChange={e => setNewLead({ ...newLead, phone_number: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Source Campaign</label>
                                                        <select disabled required className="w-full border rounded-md p-2 text-sm bg-slate-100" value={selectedCampaign.id}>
                                                            <option value={selectedCampaign.id}>{selectedCampaign.name}</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Status</label>
                                                        <select required className="w-full border rounded-md p-2 text-sm bg-white" value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })}>
                                                            <option value="">Select status</option>
                                                            {(() => {
                                                                const statuses = leadStatuses as any;
                                                                if (!statuses) return null;

                                                                if (statuses.status_choices && Array.isArray(statuses.status_choices)) {
                                                                    return statuses.status_choices.map((s: any) => (
                                                                        <option key={s.key || s.value || s} value={s.key || s.value || s}>
                                                                            {s.label || s.name || String(s)}
                                                                        </option>
                                                                    ));
                                                                }
                                                                if (Array.isArray(statuses)) {
                                                                    return statuses.map((s: any) => (
                                                                        <option key={s.key || s.value || s} value={s.key || s.value || s}>
                                                                            {s.label || s.name || String(s)}
                                                                        </option>
                                                                    ));
                                                                }
                                                                return Object.entries(statuses).map(([k, v]) => (
                                                                    <option key={k} value={k}>{String(v)}</option>
                                                                ));
                                                            })()}
                                                        </select>
                                                    </div>
                                                    <Button type="submit" className="w-full bg-[#000080]">Save Lead</Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-600 font-medium">
                                                <tr>
                                                    <th className="px-4 py-3">Name</th>
                                                    <th className="px-4 py-3">Contact Info</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {leads.filter(l => l.campaign == selectedCampaign.id || l.campaign_name === selectedCampaign.name || l.campaign === selectedCampaign.name).map(l => (
                                                    <tr key={l.id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 font-semibold">{l.fullname || l.name}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="text-xs text-slate-500">{l.email}</div>
                                                            <div className="text-xs text-slate-500">{l.phone_number || l.phone}</div>
                                                        </td>
                                                        <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">{l.status}</span></td>
                                                        <td className="px-4 py-3 text-right flex justify-end gap-1">
                                                            <Button variant="ghost" size="sm" onClick={() => openEditLead(l)}>Edit</Button>
                                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => {
                                                                setLeadToDelete(l);
                                                                setDeleteLeadOpen(true);
                                                            }}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>

                                {/* Edit Lead Dialog */}
                                <Dialog open={editLeadOpen} onOpenChange={setEditLeadOpen}>
                                    <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit Lead</DialogTitle>
                                        </DialogHeader>
                                        {editingLead && (
                                            <form onSubmit={handleEditLeadSubmit} className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <Input required value={editingLead.fullname} onChange={e => setEditingLead({ ...editingLead, fullname: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Email</label>
                                                    <Input required type="email" value={editingLead.email} onChange={e => setEditingLead({ ...editingLead, email: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Phone</label>
                                                    <Input required type="tel" value={editingLead.phone_number} onChange={e => setEditingLead({ ...editingLead, phone_number: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Status</label>
                                                    <select required className="w-full border rounded-md p-2 text-sm bg-white" value={editingLead.status} onChange={e => setEditingLead({ ...editingLead, status: e.target.value })}>
                                                        <option value="">Select status</option>
                                                        {(() => {
                                                            const statuses = leadStatuses as any;
                                                            if (!statuses) return null;

                                                            if (statuses.status_choices && Array.isArray(statuses.status_choices)) {
                                                                return statuses.status_choices.map((s: any) => (
                                                                    <option key={s.key || s.value || s} value={s.key || s.value || s}>
                                                                        {s.label || s.name || String(s)}
                                                                    </option>
                                                                ));
                                                            }
                                                            if (Array.isArray(statuses)) {
                                                                return statuses.map((s: any) => (
                                                                    <option key={s.key || s.value || s} value={s.key || s.value || s}>
                                                                        {s.label || s.name || String(s)}
                                                                    </option>
                                                                ));
                                                            }
                                                            return Object.entries(statuses).map(([k, v]) => (
                                                                <option key={k} value={k}>{String(v)}</option>
                                                            ));
                                                        })()}
                                                    </select>
                                                </div>
                                                <Button type="submit" className="w-full bg-[#000080]">Save Changes</Button>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                {/* Delete Lead Dialog */}
                                <Dialog open={deleteLeadOpen} onOpenChange={setDeleteLeadOpen}>
                                    <DialogContent className="max-w-[400px]">
                                        <DialogHeader>
                                            <DialogTitle>Confirm Deletion</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <p className="text-sm text-slate-600">
                                                Are you sure you want to delete this lead? This action cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setDeleteLeadOpen(false)}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleDeleteLead} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </Card>
                        )}

                        {/* DEMO SECTION */}
                        {campaignDetailTab === "demo" && (
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Demo Schedules</CardTitle>
                                    </div>
                                    <Button className="bg-[#000080] hover:bg-blue-900" onClick={() => setDemoOpen(true)}><Calendar className="w-4 h-4 mr-2" /> Schedule Demo</Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-600 font-medium">
                                                <tr>
                                                    <th className="px-4 py-3">Campaign</th>
                                                    <th className="px-4 py-3">Instructor</th>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Time</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {campaignDemos.map(d => (
                                                    <tr key={d.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleViewDemo(d)}>
                                                        <td className="px-4 py-3 font-semibold">{d.campaign}</td>
                                                        <td className="px-4 py-3">{d.instructor}</td>
                                                        <td className="px-4 py-3 text-slate-600">{d.date}</td>
                                                        <td className="px-4 py-3 text-slate-600">{d.time}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                                                d.status?.toLowerCase() === 'attended' ? 'bg-blue-100 text-blue-800' :
                                                                    d.status?.toLowerCase() === 'rescheduled' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {d.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewDemo(d);
                                                            }}>Details</Button>
                                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm("Are you sure you want to delete this demo?")) {
                                                                    handleDeleteDemo(d.id);
                                                                }
                                                            }}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ENROLLMENT SECTION */}
                        {campaignDetailTab === "enrollment" && (
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Enrollments</CardTitle>
                                    </div>
                                    <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#000080] hover:bg-blue-900"><CheckCircle2 className="w-4 h-4 mr-2" /> Enroll Student</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Enroll Lead to Course</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleEnroll} className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Select Lead</label>
                                                    <select
                                                        name="lead"
                                                        value={enrollForm.lead}
                                                        onChange={handleEnrollInputChange}
                                                        required
                                                        className="w-full border rounded-md p-2 text-sm bg-white"
                                                    >
                                                        <option value="">Choose a lead...</option>
                                                        {leads
                                                            .filter(l => l.campaign == selectedCampaign?.id || l.campaign_name === selectedCampaign?.name || l.campaign === selectedCampaign?.name)
                                                            .map(l => (
                                                                <option key={l.id} value={l.id}>
                                                                    {l.fullname || l.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Select Course</label>
                                                    <select
                                                        name="course"
                                                        value={enrollForm.course}
                                                        onChange={handleEnrollInputChange}
                                                        required
                                                        className="w-full border rounded-md p-2 text-sm bg-white"
                                                    >
                                                        <option value="">Choose a course...</option>
                                                        {courses.map((course) => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Enrollment Date</label>
                                                    <Input
                                                        name="enrollment_date"
                                                        value={enrollForm.enrollment_date}
                                                        onChange={handleEnrollInputChange}
                                                        required
                                                        type="date"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Fee Status</label>
                                                    <select
                                                        name="fee_status"
                                                        value={enrollForm.fee_status}
                                                        onChange={handleEnrollInputChange}
                                                        required
                                                        className="w-full border rounded-md p-2 text-sm bg-white"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Partially Paid">Partially Paid</option>
                                                        <option value="Fully Paid">Fully Paid</option>
                                                    </select>
                                                </div>
                                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                                                    {editingEnrollment ? "Update Enrollment" : "Confirm Enrollment"}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    {enrollLoading ? (
                                        <div className="py-12 text-center text-slate-500">
                                            Loading enrollments...
                                        </div>
                                    ) : enrollments.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-600 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-3">Lead</th>
                                                        <th className="px-4 py-3">Course</th>
                                                        <th className="px-4 py-3">Enrollment Date</th>
                                                        <th className="px-4 py-3">Fee Status</th>
                                                        <th className="px-4 py-3">Status</th>
                                                        <th className="px-4 py-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {enrollments.map((enrollment) => (
                                                        <tr key={enrollment.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3">{enrollment.lead_name}</td>
                                                            <td className="px-4 py-3">{enrollment.course_title}</td>
                                                            <td className="px-4 py-3 text-slate-600">{enrollment.enrollment_date}</td>
                                                            <td className="px-4 py-3">{enrollment.fee_status}</td>
                                                            <td className="px-4 py-3 capitalize">{enrollment.status}</td>
                                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => handleEditEnrollment(enrollment)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteEnrollment(enrollment.id)}>
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-center">
                                            <CheckCircle2 className="w-12 h-12 text-slate-200 mb-4" />
                                            <p className="font-medium text-lg">Ready to enroll students</p>
                                            <p className="text-sm mt-1 max-w-md">Click the "Enroll Student" button above to convert an interested lead into an active student.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}


                        {/* GLOBAL CAMPAIGN DIALOGS */}
                        <ScheduleDemoDialog
                            open={demoOpen}
                            onOpenChange={setDemoOpen}
                            selectedCampaignName={selectedCampaign?.name || ""}
                            instructors={instructors}
                            newDemo={newDemo}
                            setNewDemo={setNewDemo}
                            onSubmit={handleScheduleDemo}
                        />

                        <DemoDetailsDialog
                            open={demoDetailsOpen}
                            onOpenChange={setDemoDetailsOpen}
                            demo={selectedDemo}
                            onSaveAttendance={handleSaveAttendance}
                            onReschedule={handleReschedule}
                        />
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Preface;