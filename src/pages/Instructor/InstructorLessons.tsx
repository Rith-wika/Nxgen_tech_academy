import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    LayoutDashboard,
    BookOpen,
    Upload,
    Users,
    User,
    Loader2,
    Plus,
    Trash2,
    Edit,
    ChevronRight,
    PlayCircle,
    ArrowLeft,
    MoreVertical,
    Save,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { lessonService, Lesson } from "@/services/lessonService";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const InstructorLessons = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [formData, setFormData] = useState<Partial<Lesson>>({
        title: "",
        description: "",
        order: 0,
        is_published: true
    });

    useEffect(() => {
        if (courseId) {
            fetchLessons();
        }
    }, [courseId]);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const data = await lessonService.getCourseLessons(courseId!);
            setLessons(data || []);
        } catch (error) {
            toast.error("Failed to fetch lessons.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = () => {
        setEditingLesson(null);
        setFormData({ title: "", description: "", order: lessons.length + 1, is_published: true });
        setIsDialogOpen(true);
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setFormData({
            title: lesson.title,
            description: lesson.description || "",
            order: lesson.order || 0,
            is_published: lesson.is_published
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            if (editingLesson) {
                await lessonService.updateLesson(editingLesson.id!, formData);
                toast.success("Lesson updated successfully.");
            } else {
                await lessonService.createLesson({
                    ...formData,
                    course: courseId!,
                } as Lesson);
                toast.success("Lesson created successfully.");
            }
            setIsDialogOpen(false);
            fetchLessons();
        } catch (error) {
            toast.error("Failed to save lesson.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;
        try {
            await lessonService.deleteLesson(id);
            toast.success("Lesson deleted.");
            fetchLessons();
        } catch (error) {
            toast.error("Failed to delete lesson.");
        }
    };

    const sidebarItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
        { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
        { label: "Students", icon: Users, path: "/instructor/students" },
        { label: "Profile", icon: User, path: "/instructor/profile" },
    ];

    if (loading) {
        return (
            <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Loading...">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Manage Lessons">
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/instructor/courses")} className="text-gray-500 hover:text-[#000080] group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 duration-200" /> Back to My Courses
                </Button>
                <Button onClick={handleAddLesson} className="bg-[#000080] hover:bg-[#000060] text-sm shadow-md transition-shadow">
                    <Plus className="w-4 h-4 mr-2" /> Add New Lesson
                </Button>
            </div>

            <div className="space-y-4">
                {lessons.length === 0 ? (
                    <Card className="py-12 border-dashed border-2 flex flex-col items-center justify-center text-gray-400">
                        <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p>No lessons added yet for this course.</p>
                        <Button variant="link" onClick={handleAddLesson} className="text-[#000080]">Create your first lesson</Button>
                    </Card>
                ) : (
                    lessons.map((lesson, idx) => (
                        <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] text-gray-500 px-1 py-0 border-gray-200 uppercase font-bold tracking-tight">
                                            Lesson {idx + 1}
                                        </Badge>
                                        <CardTitle className="text-lg text-gray-800">{lesson.title}</CardTitle>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{lesson.description || "No description provided."}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleEditLesson(lesson)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(lesson.id!)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/instructor/lessons/${lesson.id}/topics`)}
                                        className="h-8 text-xs font-semibold bg-white border border-blue-100 text-[#000080] hover:bg-blue-50 hover:text-[#000080]"
                                    >
                                        Manage Topics <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
                        <DialogDescription>
                            Organize your course content by structuring them into logical lessons.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Lesson Title*</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Introduction to React"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description (Optional)</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What will students learn in this lesson..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="accent-[#000080] h-4 w-4 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Published</span>
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-[#000080] hover:bg-[#000060]">
                                {editingLesson ? "Save Changes" : "Create Lesson"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default InstructorLessons;
