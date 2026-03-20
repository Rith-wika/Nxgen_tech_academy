import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { enrollmentService } from "@/services/enrollmentService";
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

const COURSES = [
    { id: 1, name: "SAP ABAP on HANA" },
    { id: 2, name: "SAP ABAP on HANA (CDS & OData Training)" },
    { id: 3, name: "SAP Fiori & UI5" },
    { id: 4, name: "SAP SD" },
    { id: 5, name: "SAP MM" },
    { id: 6, name: "SAP FICO" },
    { id: 7, name: "SAP PP" },
    { id: 8, name: "SAP BTP For Working Professionals" },
    { id: 9, name: "SAP BTP For Freshers" },
    { id: 10, name: "SAP CPI Training" },
    { id: 11, name: "SAP QM" },
    { id: 12, name: "SAP BASIS" },
    { id: 13, name: "Python" },
    { id: 14, name: "AIML" },
    { id: 15, name: "Data Analytics" },
    { id: 16, name: "Digital Marketing" }
];

const QUALIFICATIONS = ["10th", "12th", "Graduate", "Post Graduate", "PhD", "Other"];
const CURRENT_STATUS = ["Student", "Working", "Job Seeker"];
const PREFERRED_MODES = ["Online", "Offline", "Hybrid"];
const BATCH_TIMINGS = ["Morning", "Afternoon", "Evening"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const EnrollmentForm = ({ defaultCourse, defaultCourseType, onSuccess }: EnrollmentFormProps) => {
    const courseOptions = [...COURSES];
    let initialCourseId = courseOptions[0].id;

    if (defaultCourse) {
        const matched = courseOptions.find(c => c.name === defaultCourse);
        if (matched) {
            initialCourseId = matched.id;
        }
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: initialCourseId,
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
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

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
            // First step: Submit enrollment and trigger OTP
            await enrollmentService.enroll(formData);
            toast.success("Enrollment request received. Verification required.");
            setIsOtpSent(true);
        } catch (error: any) {
            console.error("Enrollment Error:", error);
            toast.error(error.response?.data?.message || "Failed to submit enrollment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setOtpError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsSubmitting(true);
        try {
            // Here you would call enrollmentService.verifyOtp({ email: formData.email, otp });
            // For now, we simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success("OTP Verified Successfully!");
            onSuccess?.();

            // Reset form
            setFormData({
                ...formData,
                name: "",
                email: "",
                phone: "",
                collegeCompanyName: "",
                terms_accepted: false
            });
            setIsOtpSent(false);
            setOtp("");
        } catch (error: any) {
            console.error("OTP Verification Error:", error);
            setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
            toast.error("Invalid OTP");
        } finally {
            setIsSubmitting(false);
        }
    };

    const maskPhone = (phone: string) => {
        if (!phone) return "****";
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length < 4) return "****";
        // Show last 4 digits, mask the rest
        return `******${cleaned.slice(-4)}`;
    };

    if (isOtpSent) {
        return (
            <div className="py-12 px-8 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-10 h-10 text-[#000080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your Number</h2>
                    <p className="text-gray-500">
                        OTP has sent your <span className="font-semibold text-gray-700">{maskPhone(formData.phone)}</span> mobile number
                    </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="w-full max-w-sm space-y-8">
                    <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700 block text-center">Enter 6-Digit OTP</Label>
                        <div className="flex justify-between gap-2">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#000080] focus:ring-0 outline-none transition-all ${otpError ? "border-red-500" : "border-gray-200"
                                        }`}
                                    value={otp[index] || ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val) {
                                            const newOtp = otp.split("");
                                            newOtp[index] = val;
                                            const combined = newOtp.join("");
                                            setOtp(combined);
                                            setOtpError("");

                                            // Auto-focus next input
                                            if (index < 5) {
                                                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                                                nextInput?.focus();
                                            }
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace") {
                                            if (!otp[index] && index > 0) {
                                                // Focus previous input if current is empty
                                                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                                                prevInput?.focus();
                                            } else {
                                                // Clear current digit
                                                const newOtp = otp.split("");
                                                newOtp[index] = "";
                                                setOtp(newOtp.join(""));
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        {otpError && <p className="text-red-500 text-xs mt-1 text-center">{otpError}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white font-bold h-12 text-lg shadow-md transition-all rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsOtpSent(false);
                            setOtp("");
                        }}
                        className="text-sm text-gray-500 hover:text-[#000080] font-medium transition-colors"
                    >
                        Change Phone Number
                    </button>
                </form>
            </div>
        );
    }

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
                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select a course</option>
                            {courseOptions.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
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
