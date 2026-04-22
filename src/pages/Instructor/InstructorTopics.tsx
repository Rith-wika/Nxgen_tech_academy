import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    User,
    Loader2,
    Plus,
    Trash2,
    Edit,
    ArrowLeft,
    Video,
    FileText,
    Clock,
    GripVertical,
    Play,
    Settings,
    MoreVertical,
    Lock
} from "lucide-react";
import { instructorSidebarItems } from "./instructorSidebarItems";
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
import { lessonService, Topic } from "@/services/lessonService";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const InstructorTopics = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [docFile, setDocFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<Partial<Topic>>({
        title: "",
        description: "",
        video_url: "",
        duration: "",
        order: 0,
        is_published: true
    });

    const fetchTopics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await lessonService.getLessonTopics(parseInt(lessonId!));
            setTopics(data || []);
        } catch (error) {
            toast.error("Failed to fetch topics.");
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (lessonId) {
            fetchTopics();
        }
    }, [lessonId, fetchTopics]);

    const handleAddTopic = () => {
        setEditingTopic(null);
        setVideoFile(null);
        setDocFile(null);
        setFormData({ title: "", description: "", video_url: "", duration: "", order: topics.length + 1, is_published: true });
        setIsDialogOpen(true);
    };

    const handleEditTopic = (topic: Topic) => {
        setEditingTopic(topic);
        setFormData({
            title: topic.title,
            description: topic.description || "",
            video_url: topic.video_url || "",
            duration: topic.duration || "",
            order: topic.order || 0,
            is_published: topic.is_published
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        try {
            const payload: Partial<Topic> & { lesson: number; video_file?: File; document?: File } = {
                ...formData,
                lesson: parseInt(lessonId!),
            };
            if (videoFile) payload.video_file = videoFile;
            if (docFile) payload.document = docFile;

            if (editingTopic) {
                await lessonService.updateTopic(editingTopic.id!, payload);
                toast.success("Topic updated successfully.");
            } else {
                await lessonService.createTopic(payload);
                toast.success("Topic created successfully.");
            }
            setIsDialogOpen(false);
            fetchTopics();
        } catch (error) {
            toast.error("Failed to save topic.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this topic?")) return;
        try {
            await lessonService.deleteTopic(id);
            toast.success("Topic deleted.");
            fetchTopics();
        } catch (error) {
            toast.error("Failed to delete topic.");
        }
    };

    const sidebarItems = instructorSidebarItems;

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
        <DashboardLayout role="instructor" sidebarItems={sidebarItems} title="Manage Topics">
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-[#000080] group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 duration-200" /> Back
                </Button>
                <Button onClick={handleAddTopic} className="bg-[#000080] hover:bg-[#000060] text-sm shadow-md transition-shadow">
                    <Plus className="w-4 h-4 mr-2" /> Add New Topic
                </Button>
            </div>

            <div className="space-y-3">
                {topics.length === 0 ? (
                    <Card className="py-12 border-dashed border-2 flex flex-col items-center justify-center">
                        <Video className="w-12 h-12 mb-4 text-gray-200" />
                        <p className="text-gray-400">No topics found inside this lesson.</p>
                        <Button variant="link" onClick={handleAddTopic} className="text-[#000080]">Create a topic/class</Button>
                    </Card>
                ) : (
                    topics.map((topic, idx) => (
                        <div key={topic.id} className="flex items-center group bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                            <div className="hidden md:flex flex-col items-center mr-4 text-gray-200 group-hover:text-blue-200 cursor-grab">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="h-10 w-10 bg-blue-50 text-[#000080] rounded-lg flex items-center justify-center mr-4 shrink-0">
                                {topic.video_url || topic.video_file ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-gray-800 text-base truncate">{topic.title}</h4>
                                    {!topic.is_published && <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none px-1.5 py-0 text-[9px] uppercase">Draft</Badge>}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    {topic.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.duration}</span>}
                                    <span className="flex items-center gap-1 capitalize"><Play className="w-3 h-3" /> {topic.video_url ? 'External Video' : 'Local Material'}</span>
                                    <span className="hidden sm:inline line-clamp-1">{topic.description || "No description provided."}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-[#000080] hover:bg-blue-50" onClick={() => handleEditTopic(topic)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(topic.id!)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingTopic ? "Edit Topic Content" : "Add New Topic/Topic"}</DialogTitle>
                        <DialogDescription>
                            Upload educational materials, videos, and documentation for your students.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Topic Title*</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Setting up development environment"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (e.g. 15 mins)</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="Estimated study time"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">Learning Content / Description</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Summary of what will be covered in this topic..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="video">Video URL (YouTube/Vimeo)</Label>
                            <Input
                                id="video"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                placeholder="https://youtube.com/..."
                            />
                            <p className="text-[10px] text-gray-400 font-medium">Tip: Use direct video links for better embedding performance.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Upload Video File Instead</Label>
                                <Input type="file" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-xs" accept="video/*" />
                            </div>
                            <div className="space-y-2">
                                <Label>Resources (PDF, Notes, Docs)</Label>
                                <Input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="text-xs" accept=".pdf,.doc,.docx,.zip" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-3 bg-gray-50/50 rounded-lg justify-between border border-gray-100">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold">Public Visibility</Label>
                                <p className="text-[10px] text-gray-400">Making it private will keep it as draft for students.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000080]"></div>
                            </label>
                        </div>

                        <DialogFooter className="pt-4 pb-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-[#000080] hover:bg-[#000060] px-8">
                                {editingTopic ? "Update Content" : "Create Topic"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default InstructorTopics;
