import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { enrollmentService } from "@/services/enrollmentService";
import { enrollService } from "@/services/enrollService";
import { courseService } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface EnrollmentFormData {
    name: string;
    email: string;
    phone: string;
    course: number | string;
    course_type: string;
    qualification: string;
    current_status: string;
    collegeCompanyName: string;
    preferred_mode: string;
    preferred_timing: string;
    experience_level: string;
    fee_status?: string;
    enrollment_date?: string;
    terms_accepted?: boolean;
    lead?: number | string;
}

interface EnrollmentFormProps {
    defaultCourse?: string;
    defaultCourseType?: "Training" | "Industry Readiness";
    onSuccess?: () => void;
    initialData?: Partial<EnrollmentFormData>;
    demoId?: string | number;
}

// Static Fallback removed - fetching from backend

const EnrollmentForm = ({ defaultCourse, defaultCourseType, onSuccess, initialData, demoId }: EnrollmentFormProps) => {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [courseTypes, setCourseTypes] = useState<any[]>([]);
    const [currentStatuses, setCurrentStatuses] = useState<any[]>([]);
    const [modes, setModes] = useState<any[]>([]);
    const [timings, setTimings] = useState<any[]>([]);
    const [experienceLevels, setExperienceLevels] = useState<any[]>([]);
    const [feeStatuses, setFeeStatuses] = useState<any[]>([]);
    const [qualifications, setQualifications] = useState<string[]>(["10th", "12th", "Graduate", "Post Graduate", "PhD", "Other"]);
    const [attendedLeads, setAttendedLeads] = useState<any[]>([]);
    const [isLoadingLeads, setIsLoadingLeads] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<EnrollmentFormData>({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        course: initialData?.course || 0,
        course_type: initialData?.course_type || defaultCourseType || "Training",
        qualification: initialData?.qualification || "",
        current_status: initialData?.current_status || "",
        collegeCompanyName: initialData?.collegeCompanyName || "",
        preferred_mode: initialData?.preferred_mode || "",
        preferred_timing: initialData?.preferred_timing || (initialData as any)?.preferred_timing || "",
        experience_level: initialData?.experience_level || "",
        fee_status: initialData?.fee_status || "Pending",
        enrollment_date: initialData?.enrollment_date || new Date().toISOString().split('T')[0],
        terms_accepted: initialData?.terms_accepted || false,
        lead: initialData?.lead || "",
    });

    // Fetch courses once on mount or when defaultCourse changes
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                const courseList = Array.isArray(data) ? data : ((data as any).results || []);
                const formattedCourses = courseList.map((c: any) => ({
                    id: c.id,
                    name: c.title || c.name || "Unnamed Course"
                }));
                setCourses(formattedCourses);

                // Set initial course
                if (formattedCourses.length > 0) {
                    let initialId = formattedCourses[0].id;
                    if (defaultCourse) {
                        const matched = formattedCourses.find((c: any) => c.name === defaultCourse);
                        if (matched) initialId = matched.id;
                    } else if (initialData?.course) {
                        initialId = initialData.course;
                    }
                    setFormData(prev => ({ ...prev, course: initialId }));
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
                toast.error("Failed to load courses");
            } finally {
                setIsLoadingCourses(false);
            }
        };
        fetchCourses();
    }, [defaultCourse]);

    // Sync initialData.course if it changes
    useEffect(() => {
        if (initialData?.course) {
            setFormData(prev => ({ ...prev, course: initialData.course }));
        }
    }, [initialData?.course]);

    // Fetch enrollment metadata dynamically based on lead vs student enrollment
    useEffect(() => {
        const fetchMetaData = async () => {
            const isLeadEnrollment = !!(formData.lead || initialData?.lead);
            try {
                const [types, statuses, m, t, levels, fees] = await Promise.all([
                    isLeadEnrollment ? enrollService.getLeadCourseTypes() : enrollService.getStudentCourseTypes(),
                    isLeadEnrollment ? enrollService.getLeadCurrentStatuses() : enrollService.getStudentCurrentStatuses(),
                    isLeadEnrollment ? enrollService.getLeadModes() : enrollService.getStudentModes(),
                    isLeadEnrollment ? enrollService.getLeadTimings() : enrollService.getStudentTimings(),
                    isLeadEnrollment ? enrollService.getLeadExperienceLevels() : enrollService.getStudentExperienceLevels(),
                    isLeadEnrollment ? enrollService.getLeadFeeStatuses() : enrollService.getStudentFeeStatuses()
                ]);

                setCourseTypes(Array.isArray(types) ? types : (types.results || []));
                setCurrentStatuses(Array.isArray(statuses) ? statuses : (statuses.results || []));
                setModes(Array.isArray(m) ? m : (m.results || []));
                setTimings(Array.isArray(t) ? t : (t.results || []));
                setExperienceLevels(Array.isArray(levels) ? levels : (levels.results || []));
                setFeeStatuses(Array.isArray(fees) ? fees : (fees.results || []));
            } catch (error) {
                console.error("Failed to fetch enrollment metadata", error);
            }
        };
        fetchMetaData();
    }, [formData.lead, initialData?.lead]);

    useEffect(() => {
        const fetchAttendedLeads = async () => {
            if (demoId) {
                setIsLoadingLeads(true);
                try {
                    const data = await enrollService.getAttendedLeads(demoId);
                    setAttendedLeads(Array.isArray(data) ? data : (data.results || []));
                } catch (error) {
                    console.error("Error fetching attended leads", error);
                } finally {
                    setIsLoadingLeads(false);
                }
            }
        };
        fetchAttendedLeads();
    }, [demoId]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string | number) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            terms_accepted: checked,
        });
    };

    const getLeadDetails = (l: any) => {
        if (!l) return null;

        // If nested under "lead" object
        if (l.lead && typeof l.lead === 'object') {
            return {
                id: l.lead.id || l.id,
                fullname: l.lead.fullname || l.lead.full_name || l.lead.name || l.fullname || l.full_name || l.name || "",
                email: l.lead.email || l.email || "",
                phone: l.lead.phone_number || l.lead.phone || l.phone_number || l.phone || "",
            };
        }

        // Flat structure
        return {
            id: l.lead || l.lead_id || l.id,
            fullname: l.fullname || l.full_name || l.name || "",
            email: l.email || "",
            phone: l.phone_number || l.phone || l.phone_no || "",
        };
    };

    const handleLeadSelect = (leadId: string) => {
        const selected = attendedLeads.find(l => {
            const details = getLeadDetails(l);
            return details && String(details.id) === String(leadId);
        });
        if (selected) {
            const details = getLeadDetails(selected);
            if (details) {
                setFormData(prev => ({
                    ...prev,
                    lead: details.id,
                    name: details.fullname,
                    email: details.email,
                    phone: details.phone,
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.terms_accepted) {
            toast.error("Please agree to the Terms & Conditions");
            return;
        }

        setIsSubmitting(true);

        try {
            let response;
            // Get the course title (name) instead of ID for campaign or direct student enrollment
            const selectedCourseObj = courses.find(c => String(c.id) === String(formData.course));
            const courseTitle = selectedCourseObj ? selectedCourseObj.name : formData.course;

            if (formData.lead || demoId) {
                if (!formData.lead) {
                    toast.error("Please select a student first.");
                    setIsSubmitting(false);
                    return;
                }
                // For lead conversion from campaigns
                response = await enrollService.createEnrollment({
                    lead: formData.lead,
                    course: courseTitle,
                    enrollment_date: formData.enrollment_date || new Date().toISOString().split('T')[0],
                    fee_status: (formData.fee_status as any) || "Pending",
                    qualification: formData.qualification,
                    current_status: formData.current_status,
                    preferred_mode: formData.preferred_mode,
                    preferred_batch_timing: formData.preferred_timing,
                    experience_level: formData.experience_level,
                    notes: `Lead enrolled: ${formData.name}`,
                    terms_accepted: formData.terms_accepted,
                } as any);
            } else {
                // For direct student addition (admin/students page)
                response = await enrollmentService.enroll({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    course: courseTitle,
                    course_type: formData.course_type,
                    qualification: formData.qualification,
                    current_status: formData.current_status,
                    collegeCompanyName: formData.collegeCompanyName,
                    preferred_mode: formData.preferred_mode,
                    preferred_timing: formData.preferred_timing,
                    experience_level: formData.experience_level,
                    terms_accepted: formData.terms_accepted,
                });
            }
            toast.success("Enrolled to the course successfully! Redirecting...");

            // Reset form
            setFormData({
                ...formData,
                name: "",
                email: "",
                phone: "",
                collegeCompanyName: "",
                terms_accepted: false
            });

            onSuccess?.();
        } catch (error: any) {
            console.error("Enrollment Error:", error);

            // Better error handling
            let errorMessage = "Failed to submit enrollment. Please try again.";

            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    // Handle validation errors
                    const firstError = Object.values(error.response.data)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0] as string;
                    } else if (typeof firstError === 'string') {
                        errorMessage = firstError;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.error) {
                        errorMessage = error.response.data.error;
                    }
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (demoId && !formData.lead) {
        return (
            <div className="flex-1 overflow-y-auto py-6 thin-scrollbar">
                <div className="px-6 space-y-4 pb-10">
                    <label className="text-sm font-bold text-slate-800">Step 1: Select Student from Attended Leads</label>
                    {isLoadingLeads ? (
                        <div className="flex items-center justify-center py-8 text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Loading attended leads...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mt-2">
                            {attendedLeads.map((l, index) => {
                                const details = getLeadDetails(l);
                                if (!details || !details.id) return null;
                                return (
                                    <button
                                        key={details.id || index}
                                        type="button"
                                        onClick={() => handleLeadSelect(String(details.id))}
                                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 hover:border-[#000080] transition-all text-left group"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-800">{details.fullname || "Unnamed Student"}</p>
                                            <p className="text-xs text-slate-500">{details.email || "No email"} • {details.phone || "No phone"}</p>
                                        </div>
                                        <div className="text-[#000080] opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select
                                        </div>
                                    </button>
                                );
                            })}
                            {attendedLeads.length === 0 && (
                                <p className="text-center py-8 text-slate-500 italic bg-slate-50 rounded-xl">No attended leads found for this demo.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 thin-scrollbar">
            <div className="px-6 space-y-6 pb-10">
                {formData.lead && demoId && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Selected Student</p>
                            <p className="font-bold text-blue-900">{formData.name}</p>
                            <p className="text-xs text-blue-700">{formData.email} • {formData.phone}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData({ ...formData, lead: "", name: "", email: "", phone: "" })}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                            Change Student
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder=""
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder=""
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder=""
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="courseSelect" className="text-sm font-semibold text-gray-700">Course Name</Label>
                        <select
                            id="courseSelect"
                            name="course"
                            value={formData.course}
                            onChange={(e) => handleSelectChange("course", Number(e.target.value))}
                            required
                            disabled={isLoadingCourses}
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoadingCourses ? (
                                <option value="">Loading courses...</option>
                            ) : (
                                <>
                                    <option value="" disabled>Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="courseTypeSelect" className="text-sm font-semibold text-gray-700">Course Type</Label>
                        <select
                            id="courseTypeSelect"
                            name="course_type"
                            value={formData.course_type}
                            onChange={(e) => handleSelectChange("course_type", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select course type</option>
                            {courseTypes.map((t, i) => (
                                <option key={t.key || t.id || i} value={t.key || t.id || t}>{t.label || t.name || t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="qualificationSelect" className="text-sm font-semibold text-gray-700">Highest Qualification</Label>
                        <select
                            id="qualificationSelect"
                            name="qualification"
                            value={formData.qualification}
                            onChange={(e) => handleSelectChange("qualification", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select qualification</option>
                            {qualifications.map((q) => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentStatusSelect" className="text-sm font-semibold text-gray-700">Current Status</Label>
                        <select
                            id="currentStatusSelect"
                            name="current_status"
                            value={formData.current_status}
                            onChange={(e) => handleSelectChange("current_status", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select status</option>
                            {currentStatuses.map((s, i) => (
                                <option key={s.key || s.id || i} value={s.key || s.id || s}>{s.label || s.name || s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="collegeCompanyName" className="text-sm font-semibold text-gray-700">College / Company Name (Optional)</Label>
                        <Input
                            id="collegeCompanyName"
                            name="collegeCompanyName"
                            placeholder="Enter name"
                            value={formData.collegeCompanyName}
                            onChange={handleChange}
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="preferredModeSelect" className="text-sm font-semibold text-gray-700">Preferred Mode</Label>
                        <select
                            id="preferredModeSelect"
                            name="preferred_mode"
                            value={formData.preferred_mode}
                            onChange={(e) => handleSelectChange("preferred_mode", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select mode</option>
                            {modes.map((m, i) => (
                                <option key={m.key || m.id || i} value={m.key || m.id || m}>{m.label || m.name || m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preferredTimingSelect" className="text-sm font-semibold text-gray-700">Preferred Batch Timing</Label>
                        <select
                            id="preferredTimingSelect"
                            name="preferred_timing"
                            value={formData.preferred_timing}
                            onChange={(e) => handleSelectChange("preferred_timing", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select timing</option>
                            {timings.map((t, i) => (
                                <option key={t.key || t.id || i} value={t.key || t.id || t}>{t.label || t.name || t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="experienceLevelSelect" className="text-sm font-semibold text-gray-700">Experience Level</Label>
                        <select
                            id="experienceLevelSelect"
                            name="experience_level"
                            value={formData.experience_level}
                            onChange={(e) => handleSelectChange("experience_level", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select level</option>
                            {experienceLevels.map((l, i) => (
                                <option key={l.key || l.id || i} value={l.key || l.id || l}>{l.label || l.name || l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="feeStatusSelect" className="text-sm font-semibold text-gray-700">Fee Status</Label>
                        <select
                            id="feeStatusSelect"
                            name="fee_status"
                            value={formData.fee_status}
                            onChange={(e) => handleSelectChange("fee_status", e.target.value)}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select fee status</option>
                            {feeStatuses.map((s, i) => (
                                <option key={s.key || s.id || i} value={s.key || s.id || s}>{s.label || s.name || s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="enrollmentDate" className="text-sm font-semibold text-gray-700">Enrollment Date</Label>
                        <Input
                            id="enrollmentDate"
                            name="enrollment_date"
                            type="date"
                            value={formData.enrollment_date}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="terms"
                        checked={formData.terms_accepted}
                        onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer"
                    >
                        I agree to Terms & Conditions
                    </label>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white font-bold h-12 text-lg shadow-md transition-all rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div>
        </form>

    );
};

export default EnrollmentForm;
