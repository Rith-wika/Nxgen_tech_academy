import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
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
    defaultCourseType?: "Training" | "Internship" | "Master Course";
    onSuccess?: () => void;
}

const COURSES = [
    "SAP Technical & Development",
    "SAP Functional Modules",
    "SAP Business Technology Platform (BTP)",
    "SAP Specialized / Sub Courses",
    "Data Analytics",
    "Python",
    "Digital Marketing",
    "AI",
    "AIML",
    "Power BI"
];

const QUALIFICATIONS = ["10th", "12th", "Graduate", "Post Graduate", "PhD", "Other"];
const CURRENT_STATUS = ["Student", "Working", "Job Seeker"];
const PREFERRED_MODES = ["Online", "Offline", "Hybrid"];
const BATCH_TIMINGS = ["Morning", "Afternoon", "Evening"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const EnrollmentForm = ({ defaultCourse, defaultCourseType, onSuccess }: EnrollmentFormProps) => {
    const courseOptions = [...COURSES];
    if (defaultCourse && !courseOptions.includes(defaultCourse)) {
        courseOptions.unshift(defaultCourse);
    }

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        courseName: defaultCourse || courseOptions[0],
        courseType: defaultCourseType || "Training",
        highestQualification: "",
        currentStatus: "",
        collegeCompanyName: "",
        preferredMode: "",
        preferredBatchTiming: "",
        experienceLevel: "",
        agreedToTerms: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            agreedToTerms: checked,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.agreedToTerms) {
            toast.error("Please agree to the Terms & Conditions");
            return;
        }

        setIsSubmitting(true);

        try {
            await axiosInstance.post("/api/leads/enroll/", formData);
            toast.success("Enrollment request submitted successfully!");
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
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
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
                            placeholder="john@example.com"
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
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Course Name</Label>
                        <Select
                            value={formData.courseName}
                            onValueChange={(value) => handleSelectChange("courseName", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courseOptions.map((course) => (
                                    <SelectItem key={course} value={course}>
                                        {course}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Course Type</Label>
                        <Select
                            value={formData.courseType}
                            onValueChange={(value) => handleSelectChange("courseType", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Training">Training</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                                <SelectItem value="Master Course">Master Course</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Highest Qualification</Label>
                        <Select
                            value={formData.highestQualification}
                            onValueChange={(value) => handleSelectChange("highestQualification", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select qualification" />
                            </SelectTrigger>
                            <SelectContent>
                                {QUALIFICATIONS.map((q) => (
                                    <SelectItem key={q} value={q}>{q}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Current Status</Label>
                        <Select
                            value={formData.currentStatus}
                            onValueChange={(value) => handleSelectChange("currentStatus", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENT_STATUS.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        <Label className="text-sm font-semibold text-gray-700">Preferred Mode</Label>
                        <Select
                            value={formData.preferredMode}
                            onValueChange={(value) => handleSelectChange("preferredMode", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                {PREFERRED_MODES.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Preferred Batch Timing</Label>
                        <Select
                            value={formData.preferredBatchTiming}
                            onValueChange={(value) => handleSelectChange("preferredBatchTiming", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select timing" />
                            </SelectTrigger>
                            <SelectContent>
                                {BATCH_TIMINGS.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Experience Level</Label>
                        <Select
                            value={formData.experienceLevel}
                            onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                            required
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                {EXPERIENCE_LEVELS.map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                        id="terms" 
                        checked={formData.agreedToTerms}
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
