import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { enrollmentService } from "@/services/enrollmentService";
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

interface EnrollmentFormProps {
    defaultCourse?: string;
    defaultCourseType?: "Training" | "Industry Readiness";
    onSuccess?: () => void;
}

// Static Fallback removed - fetching from backend

const QUALIFICATIONS = ["10th", "12th", "Graduate", "Post Graduate", "PhD", "Other"];
const CURRENT_STATUS = ["Student", "Working", "Job Seeker"];
const PREFERRED_MODES = ["Online", "Offline", "Hybrid"];
const BATCH_TIMINGS = ["Morning", "Afternoon", "Evening"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const EnrollmentForm = ({ defaultCourse, defaultCourseType, onSuccess }: EnrollmentFormProps) => {
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                const courseList = Array.isArray(data) ? data : (data.results || []);
                // Map backend 'title' to UI 'name' if necessary
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

    const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: 0, // initially 0, will set after fetch
        course_type: defaultCourseType || "Training",
        qualification: "",
        current_status: "",
        collegeCompanyName: "",
        preferred_mode: "",
        preferred_timing: "",
        experience_level: "",
        terms_accepted: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.terms_accepted) {
            toast.error("Please agree to the Terms & Conditions");
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit enrollment directly
            await enrollmentService.enroll(formData);
            toast.success("Enrolled to the course successfully!");

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
            toast.error(error.response?.data?.message || "Failed to submit enrollment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto py-6 thin-scrollbar">
            <div className="px-6 space-y-6">
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
                            <option value="Training">Training</option>
                            <option value="Industry Readiness">Industry Readiness</option>
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
                            {QUALIFICATIONS.map((q) => (
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
                            {CURRENT_STATUS.map((s) => (
                                <option key={s} value={s}>{s}</option>
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
                            {PREFERRED_MODES.map((m) => (
                                <option key={m} value={m}>{m}</option>
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
                            {BATCH_TIMINGS.map((t) => (
                                <option key={t} value={t}>{t}</option>
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
                            {EXPERIENCE_LEVELS.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
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
