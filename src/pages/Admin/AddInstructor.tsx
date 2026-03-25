import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { instructorService } from "@/services/instructorService";
import { courseService } from "@/services/courseService";
import { Loader2, Upload, X, ArrowLeft, LayoutDashboard, Users, UserCheck, Settings, Check, ChevronsUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: UserCheck, path: "/admin/instructors" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const instructorSchema = z.object({
    full_name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    employee_id: z.string().min(1, "Employee ID is required"),
    date_of_joining: z.string().min(1, "Date of joining is required"),
    qualification: z.string().min(1, "Qualification is required"),
    experience: z.string().min(1, "Experience is required"),
    bank_account_number: z.string().min(1, "Bank account number is required"),
    ifsc_code: z.string().min(1, "IFSC Code is required"),
    pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    aadhaar_number: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
    is_active: z.boolean().default(true),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

const AddInstructor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
    const [openCourseSelect, setOpenCourseSelect] = useState(false);
    const [documentName, setDocumentName] = useState<string>("");
    const [document, setDocument] = useState<File | null>(null);



    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<InstructorFormValues>({
        resolver: zodResolver(instructorSchema),
        defaultValues: {
            is_active: true,
        }
    });

    const [courseList, setCourseList] = useState<{ id: number; title: string }[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                console.log("Fetching courses in AddInstructor component...");
                const data = await courseService.getAllCourses();
                const courseArray = Array.isArray(data) ? data : [];
                console.log("Courses loaded:", courseArray);
                
                if (courseArray && courseArray.length > 0) {
                    setCourseList(courseArray);
                } else {
                    toast.warning("No courses available. Please add courses first.");
                }
            } catch (error) {
                console.error("Failed to fetch courses from API", error);
                toast.error("Failed to load courses. Please refresh the page.");
            }
        };
        fetchCourses();
    }, []);

    const onSubmit = async (data: InstructorFormValues) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                assigned_courses: selectedCourses,
                document_name: documentName,
                documents: document,
            };
            await instructorService.createInstructor(payload);
            toast.success("Instructor created successfully");
            navigate("/admin/instructors");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create instructor");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                toast.error("Only PDF, JPG, and PNG are allowed");
                return;
            }
            setDocument(file);
        }
    };

    return (
        <DashboardLayout role="admin" sidebarItems={sidebarItems} title="NxGen Admin">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full xl:max-w-screen-xl mx-auto px-4 md:px-8 min-h-[calc(100vh-100px)]"
            >
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" onClick={() => navigate("/admin/instructors")}>
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Instructor</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-[#000080] p-4 text-white">
                            <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
                        </div>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name*</Label>
                                <Input id="name" {...register("full_name")} placeholder="Enter full name" />
                                {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email*</Label>
                                <Input id="email" type="email" {...register("email")} placeholder="example@email.com" />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number*</Label>
                                <Input id="phone" {...register("phone")} placeholder="10-digit number" />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employee Details */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-[#000080] p-4 text-white">
                            <CardTitle className="text-lg font-semibold">Employee Details</CardTitle>
                        </div>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Employee ID*</Label>
                                <Input id="employee_id" {...register("employee_id")} placeholder="EMP001" />
                                {errors.employee_id && <p className="text-red-500 text-xs">{errors.employee_id.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_joining">Date of Joining*</Label>
                                <Input id="date_of_joining" type="date" {...register("date_of_joining")} />
                                {errors.date_of_joining && <p className="text-red-500 text-xs">{errors.date_of_joining.message}</p>}
                            </div>
                            <div className="space-y-2 col-span-full flex flex-col">
                                <Label htmlFor="course">Assign Courses</Label>
                                <Popover open={openCourseSelect} onOpenChange={setOpenCourseSelect}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCourseSelect}
                                            className="w-full justify-between h-auto min-h-[2.5rem] py-2 px-3 border border-slate-200 shadow-sm hover:bg-transparent"
                                        >
                                            <div className="flex flex-wrap gap-1 items-center">
                                                {selectedCourses.length > 0 ? (
                                                    selectedCourses.map((courseId) => {
                                                        const course = courseList.find(c => c.id === courseId);
                                                        return (
                                                            <Badge
                                                                key={courseId}
                                                                variant="secondary"
                                                                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold bg-[#f0f4ff] text-[#000080] border border-[#e0e7ff] hover:bg-[#e8edff] transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
                                                                }}
                                                            >
                                                                {course ? course.title : `ID: ${courseId}`}
                                                                <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500 transition-colors" />
                                                            </Badge>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-muted-foreground font-normal">Select courses...</span>
                                                )}
                                            </div>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search courses..." />
                                            <CommandList>
                                                <CommandEmpty>No course found.</CommandEmpty>
                                                <CommandGroup className="max-h-64 overflow-y-auto">
                                                    {courseList.map((course) => (
                                                        <CommandItem
                                                            key={course.id}
                                                            value={course.title}
                                                            onSelect={() => {
                                                                const courseId = course.id;
                                                                setSelectedCourses(prev =>
                                                                    prev.includes(courseId)
                                                                        ? prev.filter(id => id !== courseId)
                                                                        : [...prev, courseId]
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedCourses.includes(course.id) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {course.title}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic & Professional Info */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-[#000080] p-4 text-white">
                            <CardTitle className="text-lg font-semibold">Academic & Professional Info</CardTitle>
                        </div>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="qualification">Qualification*</Label>
                                <Input id="qualification" {...register("qualification")} placeholder="e.g. M.Tech, PhD" />
                                {errors.qualification && <p className="text-red-500 text-xs">{errors.qualification.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience*</Label>
                                <Select onValueChange={(val) => setValue("experience", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fresher">Fresher</SelectItem>
                                        <SelectItem value="1-3 Years">1–3 Years</SelectItem>
                                        <SelectItem value="3+ Years">3+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.experience && <p className="text-red-500 text-xs">{errors.experience.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank & Identity Details */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-[#000080] p-4 text-white">
                            <CardTitle className="text-lg font-semibold">Bank & Identity Details</CardTitle>
                        </div>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bank_account_number">Bank Account Number</Label>
                                <Input id="bank_account_number" {...register("bank_account_number")} placeholder="Enter account number" />
                                {errors.bank_account_number && <p className="text-red-500 text-xs">{errors.bank_account_number.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ifsc_code">IFSC Code</Label>
                                <Input id="ifsc_code" {...register("ifsc_code")} placeholder="ABCD0123456" />
                                {errors.ifsc_code && <p className="text-red-500 text-xs">{errors.ifsc_code.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pan_number">PAN Number</Label>
                                <Input id="pan_number" {...register("pan_number")} placeholder="ABCDE1234F" />
                                {errors.pan_number && <p className="text-red-500 text-xs">{errors.pan_number.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                                <Input id="aadhaar_number" {...register("aadhaar_number")} placeholder="12-digit number" />
                                {errors.aadhaar_number && <p className="text-red-500 text-xs">{errors.aadhaar_number.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents & Status */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-[#000080] p-4 text-white">
                            <CardTitle className="text-lg font-semibold">Document Upload & Status</CardTitle>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-2 grid h-full content-start">
                                    <Label>Document Upload Name</Label>
                                    <Select onValueChange={setDocumentName} value={documentName}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Aadhar">Aadhar</SelectItem>
                                            <SelectItem value="PAN card">PAN card</SelectItem>
                                            <SelectItem value="others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Upload Selected Document</Label>
                                    <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#000080] transition-colors cursor-pointer relative min-h-[140px] w-full">
                                        <div className="space-y-1 text-center flex flex-col items-center justify-center h-full w-full">
                                            {document ? (
                                                <div className="flex flex-col items-center z-10" onClick={(e) => e.preventDefault()}>
                                                    <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md mb-2">
                                                        <span className="text-sm font-medium">{document.name}</span>
                                                        <button type="button" onClick={(e) => { e.preventDefault(); setDocument(null); }}><X className="w-4 h-4" /></button>
                                                    </div>
                                                    <p className="text-xs text-gray-500">File uploaded successfully</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#000080] hover:text-[#000060]">
                                                            Upload a file
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                                                        </span>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Active Status</Label>
                                    <p className="text-sm text-gray-500">Enable or disable instructor access</p>
                                </div>
                                <Switch
                                    checked={watch("is_active")}
                                    onCheckedChange={(val) => setValue("is_active", val)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 mt-8 pb-10">
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/instructors")} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#000080] hover:bg-[#000060] min-w-[150px]" disabled={loading}>
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create Instructor"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </DashboardLayout>
    );
};

export default AddInstructor;
