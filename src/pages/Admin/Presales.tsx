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
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminSidebarItems } from "./adminSidebarItems";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { campaignService, Campaign } from "@/services/campaignService";
import { leadService } from "@/services/leadService";
import { courseService } from "@/services/courseService";
import { enrollService, LeadEnrollmentData } from "@/services/enrollService";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Search } from "lucide-react";
import { instructorService } from "@/services/instructorService";
import { demoService } from "@/services/demoService";
import dashboardService, { DashboardStats } from "@/services/dashboardService";
import DemoDetailsDialog from "./components/DemoDetailsDialog";
import ScheduleDemoDialog from "./components/ScheduleDemoDialog";
import { AddLeadDialog, EditLeadDialog, DeleteLeadDialog } from "./components/LeadDialogs";
import { AddCampaignDialog, EditCampaignDialog, DeleteCampaignDialog } from "./components/CampaignDialogs";
import EnrollmentForm from "@/components/EnrollmentForm";

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

const Presales = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem("presales_active_tab") || "overview";
    });
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(() => {
        const saved = sessionStorage.getItem("presales_selected_campaign");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    const [campaignDetailTab, setCampaignDetailTab] = useState(() => {
        return sessionStorage.getItem("presales_campaign_detail_tab") || "leads";
    });

    // Sync navigation state to sessionStorage to survive page refreshes
    useEffect(() => {
        sessionStorage.setItem("presales_active_tab", activeTab);
    }, [activeTab]);

    useEffect(() => {
        if (selectedCampaign) {
            sessionStorage.setItem("presales_selected_campaign", JSON.stringify(selectedCampaign));
        } else {
            sessionStorage.removeItem("presales_selected_campaign");
        }
    }, [selectedCampaign]);

    useEffect(() => {
        sessionStorage.setItem("presales_campaign_detail_tab", campaignDetailTab);
    }, [campaignDetailTab]);


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
    const [allEnrollments, setAllEnrollments] = useState<any[]>([]);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
    const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
    const [enrollForm, setEnrollForm] = useState<LeadEnrollmentData>({
        lead: "",
        course: "",
        enrollment_date: "",
        fee_status: "Pending",
        qualification: "",
        current_status: "",
        preferred_mode: "",
        preferred_batch_timing: "",
        experience_level: "",
        status: "pending",
        notes: "",
    });
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDashboardStats = async () => {
        try {
            const data = await dashboardService.getStats();
            setDashboardStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    const refreshData = () => {
        fetchDashboardStats();
        fetchCampaigns();
        fetchStatuses();
        fetchLeads();
        fetchLeadStatuses();
        fetchInstructors();
        fetchDemos();
        fetchCourses();
        fetchAllEnrollments();
        setLastUpdated(new Date().toLocaleTimeString());
        toast.success("Dashboard data refreshed!");
    };

    useEffect(() => {
        refreshData();
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

    const fetchAllEnrollments = async () => {
        try {
            const data: any = await enrollService.getEnrollments();
            setAllEnrollments(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error("Failed to load all enrollments", error);
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
    const [newCampaign, setNewCampaign] = useState({ name: "", startDate: "", endDate: "", desc: "", status: "active", course: "" });
    const [newLead, setNewLead] = useState({ fullname: "", email: "", phone_number: "", campaign: "", status: "New" });
    const [newDemo, setNewDemo] = useState({ instructor: "", date: "", time: "", link: "" });
    const [selectedDemo, setSelectedDemo] = useState<any>(null);
    const [reschedulingParticipants, setReschedulingParticipants] = useState<any[]>([]);

    const campaignDemos = selectedCampaign
        ? demos.filter(d => {
            const dCampaign = d.campaign;
            const dCampaignId = (d as any).campaign_id;

            if (!dCampaign && !dCampaignId) return false;

            const matchesId = (id: any) => id && String(id) === String(selectedCampaign.id);
            const matchesName = (name: any) => name && typeof name === 'string' && name.toLowerCase() === selectedCampaign.name.toLowerCase();

            if (matchesId(dCampaign) || matchesId(dCampaignId) || matchesName(dCampaign)) return true;

            if (typeof dCampaign === 'object' && dCampaign !== null) {
                if (matchesId((dCampaign as any).id) || matchesName((dCampaign as any).name)) return true;
            }

            return false;
        })
        : [];
    const currentDemoId = campaignDemos[0]?.id;

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
    const [isDeleteEnrollOpen, setIsDeleteEnrollOpen] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState<any>(null);
    const [isDeleteDemoOpen, setIsDeleteDemoOpen] = useState(false);
    const [demoToDelete, setDemoToDelete] = useState<any>(null);

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
                status: editingCampaign.status,
                course: editingCampaign.course
            } as any);
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
                status: newCampaign.status,
                course: (newCampaign as any).course
            } as any);
            toast.success("Campaign created successfully!");
            setNewCampaign({ name: "", startDate: "", endDate: "", desc: "", status: "Active", course: "" });
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

    const handleDeleteDemoClick = (demo: any) => {
        setDemoToDelete(demo);
        setIsDeleteDemoOpen(true);
    };

    const handleConfirmDeleteDemo = async () => {
        if (!demoToDelete) return;
        try {
            await demoService.deleteDemo(demoToDelete.id);
            toast.success("Demo deleted successfully!");
            fetchDemos();
        } catch (error) {
            toast.error("Failed to delete demo.");
            console.error(error);
        } finally {
            setIsDeleteDemoOpen(false);
            setDemoToDelete(null);
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
            qualification: "",
            current_status: "",
            preferred_mode: "",
            preferred_batch_timing: "",
            experience_level: "",
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
            qualification: enrollment.qualification || "",
            current_status: enrollment.current_status || "",
            preferred_mode: enrollment.preferred_mode || "",
            preferred_batch_timing: enrollment.preferred_batch_timing || "",
            experience_level: enrollment.experience_level || "",
            status: enrollment.status,
            notes: enrollment.notes || "",
        });
        setEnrollOpen(true);
    };

    const handleDeleteEnrollmentClick = (enrollment: any) => {
        setEnrollmentToDelete(enrollment);
        setIsDeleteEnrollOpen(true);
    };

    const handleConfirmDeleteEnrollment = async () => {
        if (!enrollmentToDelete) return;
        try {
            await enrollService.deleteEnrollment(enrollmentToDelete.id);
            toast.success("Enrollment deleted successfully.");
            if (selectedCampaign) {
                fetchEnrollments(selectedCampaign.id);
            }
        } catch (error) {
            console.error("Failed to delete enrollment", error);
            toast.error("Failed to delete enrollment.");
        } finally {
            setIsDeleteEnrollOpen(false);
            setEnrollmentToDelete(null);
        }
    };

    // --- Dynamic Calculations for Overview ---
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const campaignsThisMonth = campaigns.filter(c => {
        if (!c.start_date) return false;
        const d = new Date(c.start_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const leadsThisMonth = leads.filter(l => {
        const dateStr = l.created_at || l.date || (l.id ? null : new Date().toISOString());
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const demosThisMonth = demos.filter(d => {
        if (!d.date) return false;
        const dt = new Date(d.date);
        return dt.getMonth() === currentMonth && dt.getFullYear() === currentYear;
    });

    const enrollmentsThisMonth = allEnrollments.filter(e => {
        if (!e.enrollment_date) return false;
        const d = new Date(e.enrollment_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Calculate Conversion Rate
    const conversionRate = leads.length > 0
        ? ((allEnrollments.length / leads.length) * 100).toFixed(1)
        : "0";

    // Chart Data: Funnel
    const funnelData = [
        { name: "Leads", value: leads.length, color: "#3b82f6" },
        { name: "Demos", value: demos.length, color: "#f59e0b" },
        { name: "Enrollments", value: allEnrollments.length, color: "#10b981" }
    ];

    // Chart Data: Campaign Performance (More stable than daily trends)
    const campaignPerformanceData = campaigns.slice(0, 6).map(c => {
        const cLeads = leads.filter(l => l.campaign == c.id || l.campaign_name === c.name || l.campaign === c.name).length;
        // Find enrollments for leads in this campaign
        const cEnrollments = allEnrollments.filter(e => {
            const lead = leads.find(l => l.id == e.lead);
            return lead && (lead.campaign == c.id || lead.campaign_name === c.name || lead.campaign === c.name);
        }).length;

        return {
            name: c.name.length > 12 ? c.name.substring(0, 10) + '..' : c.name,
            Leads: cLeads,
            Enrollments: cEnrollments,
            fullName: c.name
        };
    });

    // If no campaigns, show some empty state data for the chart
    const chartData = campaignPerformanceData.length > 0 ? campaignPerformanceData : [
        { name: "No Data", Leads: 0, Enrollments: 0 }
    ];

    return (
        <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
            <div className="rounded-2xl mb-6 p-6 bg-gradient-to-r from-[#0f172a] via-[#1d2a7a] to-[#0b5fa6] text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Presales & Campaign Management</h1>
                        <p className="text-blue-100 text-sm mt-1">Manage all your campaigns, leads, demos, and enrollments in one place.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
                            onClick={refreshData}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                        <p className="text-[10px] text-blue-200">Last updated: {lastUpdated}</p>
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
                    <div className="space-y-8">
                        {/* Top Section: Summary Cards (1x4 Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Total Campaigns",
                                    value: dashboardStats?.total_campaigns ?? campaigns.length,
                                    change: `${campaignsThisMonth.length} Increase`,
                                    color: "bg-[#000080]",
                                    progress: campaigns.length > 0 ? (campaignsThisMonth.length / campaigns.length) * 100 : 0
                                },
                                {
                                    title: "Total Leads",
                                    value: (dashboardStats?.total_leads ?? leads.length).toLocaleString(),
                                    change: `${leadsThisMonth.length} Increase`,
                                    color: "bg-[#000080]",
                                    progress: leads.length > 0 ? (leadsThisMonth.length / leads.length) * 100 : 0
                                },
                                {
                                    title: "Total Demos",
                                    value: dashboardStats?.total_demos ?? demos.length,
                                    change: `${demosThisMonth.length} This Month`,
                                    color: "bg-[#000080]",
                                    progress: 75
                                },
                                {
                                    title: "Enrollments",
                                    value: dashboardStats?.total_enrollments ?? allEnrollments.length,
                                    change: `${conversionRate}% Conversion`,
                                    color: "bg-[#f97316]",
                                    progress: parseFloat(conversionRate)
                                }
                            ].map((stat, idx) => (
                                <Card key={idx} className="border-none shadow-md bg-white p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{stat.title}</p>
                                        <h3 className="text-4xl font-black text-[#000080] mb-4">{stat.value}</h3>
                                        <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                                            <div className={`h-full ${stat.color}`} style={{ width: `${stat.progress}%` }} />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500">{stat.change}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Middle Section: Main Performance Chart (Full Width) */}
                        <Card className="border-none shadow-md bg-white overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                                <div>
                                    <CardTitle className="text-xl font-black text-[#000080]">Campaign Performance Report</CardTitle>
                                    <CardDescription className="text-slate-400 font-medium">Leads vs Enrollments per Campaign</CardDescription>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-[#000080] rounded-sm" />
                                        <span className="text-sm font-bold text-slate-600">Leads</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-[#f97316] rounded-sm" />
                                        <span className="text-sm font-bold text-slate-600">Enrollments</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-10">
                                <div className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                                labelStyle={{ fontWeight: '900', color: '#000080', marginBottom: '8px' }}
                                            />
                                            <Bar dataKey="Leads" fill="#000080" radius={[4, 4, 0, 0]} barSize={60} />
                                            <Bar dataKey="Enrollments" fill="#f97316" radius={[4, 4, 0, 0]} barSize={60} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom Section: Recent Enrollments List (Full Width) */}
                        <Card className="border-none shadow-md bg-white">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                                <div>
                                    <CardTitle className="text-xl font-black text-[#000080]">Recent Enrollments</CardTitle>
                                    <CardDescription className="text-slate-400 font-medium">Latest successful conversions</CardDescription>
                                </div>
                                <Button variant="outline" className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-bold rounded-xl" onClick={() => setActiveTab("campaign")}>
                                    View All Enrollments
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 text-[12px] uppercase tracking-widest text-slate-400 font-black">
                                            <th className="px-8 py-5">Student Name</th>
                                            <th className="px-8 py-5">Course</th>
                                            <th className="px-8 py-5">Date</th>
                                            <th className="px-8 py-5">Fee Status</th>
                                            <th className="px-8 py-5">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {allEnrollments.slice(0, 8).map((enroll, idx) => (
                                            <tr key={enroll.id || idx} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#000080]/5 flex items-center justify-center text-[#000080] font-black text-sm">
                                                            {enroll.lead_name?.charAt(0) || "S"}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{enroll.lead_name || "Unknown Student"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-slate-500">{enroll.course_title || "Course Not Set"}</span>
                                                </td>
                                                <td className="px-8 py-5 text-slate-400 font-bold">
                                                    {enroll.enrollment_date ? new Date(enroll.enrollment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "May 14, 2026"}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${enroll.fee_status === 'Fully Paid' ? 'bg-green-100 text-green-700' :
                                                        enroll.fee_status === 'Partially Paid' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>{enroll.fee_status || "Pending"}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-all border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white rounded-xl h-9 px-4 font-bold" onClick={() => handleEditEnrollment(enroll)}>Manage</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {allEnrollments.length === 0 && (
                                    <div className="py-20 text-center text-slate-400 font-bold italic bg-slate-50/30">No enrollments recorded yet.</div>
                                )}
                            </CardContent>
                        </Card>
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
                                                        status: c.status,
                                                        course: (c as any).course || ""
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
                            courses={courses}
                            handleEditCampaignSubmit={handleEditCampaignSubmit}
                            handleDeleteCampaign={handleDeleteCampaign}
                        />

                        <EditCampaignDialog
                            editCampaignOpen={editCampaignOpen}
                            setEditCampaignOpen={setEditCampaignOpen}
                            editingCampaign={editingCampaign}
                            setEditingCampaign={setEditingCampaign}
                            campaignStatuses={campaignStatuses}
                            courses={courses}
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
                            courses={courses}
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
                                                                handleDeleteDemoClick(d);
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
                                            <Button className="bg-[#000080] hover:bg-blue-900"><CheckCircle2 className="w-4 h-4 mr-2" />Enroll Lead</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pb-0">
                                            <DialogHeader>
                                                <DialogTitle>Enroll Lead to Course</DialogTitle>
                                            </DialogHeader>
                                            <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                                                {!enrollForm.lead && !currentDemoId ? (
                                                    <div className="space-y-4">
                                                        <label className="text-sm font-medium">Step 1: Select a Lead to Enroll</label>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {leads
                                                                .filter(l => l.campaign == selectedCampaign?.id || l.campaign_name === selectedCampaign?.name || l.campaign === selectedCampaign?.name)
                                                                .map(l => (
                                                                    <button
                                                                        key={l.id}
                                                                        onClick={() => {
                                                                            const leadName = l.fullname || l.name || "";
                                                                            setEnrollForm({
                                                                                ...enrollForm,
                                                                                lead: l.id,
                                                                                lead_name: leadName,
                                                                                lead_email: l.email || ""
                                                                            });
                                                                        }}
                                                                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 hover:border-[#000080] transition-all text-left group"
                                                                    >
                                                                        <div>
                                                                            <p className="font-bold text-slate-800">{l.fullname || l.name}</p>
                                                                            <p className="text-xs text-slate-500">{l.email || "No email"} • {l.phone_number || "No phone"}</p>
                                                                        </div>
                                                                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-[#000080]" />
                                                                    </button>
                                                                ))}
                                                            {leads.filter(l => l.campaign == selectedCampaign?.id || l.campaign_name === selectedCampaign?.name || l.campaign === selectedCampaign?.name).length === 0 && (
                                                                <p className="text-center py-8 text-slate-500 italic">No leads available in this campaign.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col flex-1 overflow-hidden">
                                                        {enrollForm.lead && (
                                                            <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg">
                                                                <div>
                                                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Enrolling Lead</p>
                                                                    <p className="font-bold text-blue-900">{enrollForm.lead_name}</p>
                                                                </div>
                                                                <Button variant="ghost" size="sm" onClick={() => setEnrollForm({ ...enrollForm, lead: "" })} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                                                                    Change Lead
                                                                </Button>
                                                            </div>
                                                        )}
                                                        <EnrollmentForm
                                                            demoId={currentDemoId}
                                                            initialData={{
                                                                name: enrollForm.lead_name,
                                                                email: enrollForm.lead_email,
                                                                phone: leads.find(l => l.id === enrollForm.lead)?.phone_number || "",
                                                                course: enrollForm.course,
                                                                lead: enrollForm.lead
                                                            }}
                                                            onSuccess={() => {
                                                                setEnrollOpen(false);
                                                                setEnrollForm({
                                                                    lead: "",
                                                                    course: "",
                                                                    enrollment_date: "",
                                                                    fee_status: "Pending",
                                                                    qualification: "",
                                                                    current_status: "",
                                                                    preferred_mode: "",
                                                                    preferred_batch_timing: "",
                                                                    experience_level: "",
                                                                    status: "pending",
                                                                    notes: ""
                                                                });
                                                                fetchEnrollments(selectedCampaign?.id);
                                                                fetchAllEnrollments();
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
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
                                                        <th className="px-4 py-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {enrollments.map((enrollment) => (
                                                        <tr key={enrollment.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-semibold">{enrollment.full_name || enrollment.name || enrollment.lead_name}</td>
                                                            <td className="px-4 py-3">{enrollment.course_title}</td>
                                                            <td className="px-4 py-3 text-slate-600">{enrollment.enrollment_date}</td>
                                                            <td className="px-4 py-3">{enrollment.fee_status}</td>
                                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => handleEditEnrollment(enrollment)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteEnrollmentClick(enrollment)}>
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

            <DeleteConfirmDialog
                isOpen={isDeleteEnrollOpen}
                onOpenChange={setIsDeleteEnrollOpen}
                onConfirm={handleConfirmDeleteEnrollment}
                title="Delete Enrollment"
                description={`Are you sure you want to delete the enrollment for "${enrollmentToDelete?.full_name || enrollmentToDelete?.name || enrollmentToDelete?.lead_name || 'this student'}"? This action cannot be undone.`}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDemoOpen}
                onOpenChange={setIsDeleteDemoOpen}
                onConfirm={handleConfirmDeleteDemo}
                title="Delete Demo"
                description={`Are you sure you want to delete the demo campaign "${demoToDelete?.campaign || 'this demo'}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    );
};

export default Presales;