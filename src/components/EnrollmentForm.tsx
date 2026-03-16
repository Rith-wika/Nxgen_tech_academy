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
        specialization: "",
        collegeName: "",
        graduationYear: "",
    });
    const [resume, setResume] = useState<File | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (resume) {
            data.append("resume", resume);
        }

        try {
            // Adjust the endpoint as needed. For now, using a placeholder or existing lead endpoint if compatible
            await axiosInstance.post("/api/leads/enroll/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Enrollment request submitted successfully!");
            onSuccess?.();
        } catch (error: any) {
            console.error("Enrollment Error:", error);
            // Even if the backend isn't ready, we show a success message to the user for the demo/UI part if requested
            // but for a real app, we'd handle the error.
            toast.error(error.response?.data?.message || "Failed to submit enrollment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1 py-2">
            <div className="grid grid-cols-1 gap-6">
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

            <div className="grid grid-cols-1 gap-6">
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

            <div className="grid grid-cols-1 gap-6">
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
                    <Label htmlFor="highestQualification" className="text-sm font-semibold text-gray-700">Highest Qualification</Label>
                    <Input
                        id="highestQualification"
                        name="highestQualification"
                        placeholder="e.g. B.Tech, Degree"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        required
                        className="h-11"
                    />
                </div>
            </div>



            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="graduationYear" className="text-sm font-semibold text-gray-700">Graduation Year</Label>
                    <Input
                        id="graduationYear"
                        name="graduationYear"
                        placeholder="e.g. 2024"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        required
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="resume" className="text-sm font-semibold text-gray-700">Resume (PDF/DOC)</Label>
                    <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                        className="cursor-pointer h-11 py-2"
                    />
                </div>
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white font-bold h-12 text-lg shadow-md transition-all"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </Button>
            </div>
        </form>
    );
};

export default EnrollmentForm;
