import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, Download, CheckCircle, ArrowLeft, Clock, Award, Users, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import axiosInstance from "@/api/axiosInstance";

interface LessonItem {
    id: number;
    title: string;
    content?: string;
    file?: string | null;
    video_url?: string | null;
    resource_title?: string;
    resource_link?: string;
    assignment_title?: string;
    assignment_description?: string;
    assignment_due_date?: string | null;
    order: number;
    module: number;
}

interface ModuleItem {
    id: number;
    title: string;
    section_type: "training" | "industry_readiness";
    order: number;
    lessons: LessonItem[];
}

interface CourseContent {
    id: number;
    title: string;
    description: string;
    price: string;
    category: number;
    training_modules: ModuleItem[];
    industry_readiness_modules: ModuleItem[];
}

interface FlatLesson extends LessonItem {
    module_title: string;
    section_type: "training" | "industry_readiness";
}

const toEmbedUrl = (url?: string | null) => {
    if (!url) return "";

    // Convert common YouTube links to embeddable format for iframe playback.
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);

    const videoId = watchMatch?.[1] || liveMatch?.[1] || shortMatch?.[1];
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
};

const getLessonBadge = (lesson: FlatLesson) => {
    if (lesson.section_type === "industry_readiness") {
        return "Industry";
    }
    if (lesson.assignment_title) {
        return "Assignment";
    }
    return "Lesson";
};

const CourseViewer = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<CourseContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allLessons, setAllLessons] = useState<FlatLesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<FlatLesson | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`/api/courses/courses/${id}/content/`);
                const courseData = response.data as CourseContent;
                const trainingModules = Array.isArray(courseData.training_modules) ? courseData.training_modules : [];
                const industryModules = Array.isArray(courseData.industry_readiness_modules) ? courseData.industry_readiness_modules : [];

                const mergedLessons: FlatLesson[] = [...trainingModules, ...industryModules]
                    .sort((a, b) => a.order - b.order)
                    .flatMap((module) => {
                        const lessons = Array.isArray(module.lessons) ? module.lessons : [];
                        return lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => ({
                                ...lesson,
                                module_title: module.title,
                                section_type: module.section_type,
                            }));
                    });

                setCourse(courseData);
                setAllLessons(mergedLessons);
                setActiveLesson(mergedLessons[0] || null);

                if (!courseData) {
                    navigate("/student/dashboard");
                }
            } catch (error) {
                console.error("Error fetching course viewer data:", error);
                navigate("/student/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#000080] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Preparing your classroom...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    const activeLessonIndex = activeLesson ? allLessons.findIndex((lesson) => lesson.id === activeLesson.id) : -1;
    const nextLesson = activeLessonIndex >= 0 ? allLessons[activeLessonIndex + 1] : null;
    const assignmentsCount = allLessons.filter((lesson) => lesson.assignment_title).length;
    const hasResource = !!(activeLesson?.resource_link || activeLesson?.file);

    return (
        <div className="min-h-screen bg-white">
            <SEO title={`${course.title} - Learning Portal`} description={course.description} />

            {/* Header */}
            <div className="bg-[#000080] text-white py-4 sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link to="/student/dashboard" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <div className="hidden md:block">
                        <h1 className="text-lg font-bold line-clamp-1">{course.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
                            Authorized Access
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Video Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                            {activeLesson?.video_url ? (
                                <iframe
                                    className="w-full h-full"
                                    src={toEmbedUrl(activeLesson.video_url)}
                                    title={activeLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/90 bg-gradient-to-br from-gray-900 to-black">
                                    <div className="text-center px-6">
                                        <PlayCircle className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                                        <h3 className="text-xl font-bold mb-2">No Video Uploaded</h3>
                                        <p className="text-sm text-gray-300">This lesson includes notes, resources, or assignments only.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#000080]">{activeLesson?.title || "Select a lesson"}</h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-[#000080] text-[#000080] h-10"
                                        disabled={!hasResource}
                                        onClick={() => {
                                            const resourceUrl = activeLesson?.resource_link || activeLesson?.file;
                                            if (resourceUrl) {
                                                window.open(resourceUrl, "_blank", "noopener,noreferrer");
                                            }
                                        }}
                                    >
                                        <Download className="w-4 h-4" /> Resources
                                    </Button>
                                    <Button
                                        className="gap-2 bg-secondary hover:bg-secondary/90 text-white h-10"
                                        disabled={!nextLesson}
                                        onClick={() => {
                                            if (nextLesson) {
                                                setActiveLesson(nextLesson);
                                            }
                                        }}
                                    >
                                        Next Lesson
                                    </Button>
                                </div>
                            </div>

                            <Tabs defaultValue="overview" className="w-full mt-6">
                                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                                    <TabsTrigger value="overview" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#000080] data-[state=active]:bg-transparent data-[state=active]:text-[#000080] bg-transparent shadow-none text-sm font-bold">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="curriculum" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#000080] data-[state=active]:bg-transparent data-[state=active]:text-[#000080] bg-transparent shadow-none text-sm font-bold">
                                        Full Syllabus
                                    </TabsTrigger>
                                    <TabsTrigger value="notes" className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#000080] data-[state=active]:bg-transparent data-[state=active]:text-[#000080] bg-transparent shadow-none text-sm font-bold">
                                        Notes
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">Learning Path</h3>
                                        <p className="text-gray-600 leading-relaxed">{activeLesson?.content || course.description || "Content will be updated by your instructor soon."}</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                                        <div className="text-center">
                                            <Clock className="w-6 h-6 mx-auto mb-2 text-secondary" />
                                            <span className="block text-sm font-bold text-gray-800">{allLessons.length} Lessons</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Course Length</span>
                                        </div>
                                        <div className="text-center">
                                            <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                                            <span className="block text-sm font-bold text-gray-800">Instructor Led</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Content</span>
                                        </div>
                                        <div className="text-center">
                                            <Award className="w-6 h-6 mx-auto mb-2 text-secondary" />
                                            <span className="block text-sm font-bold text-gray-800">Professional</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Level</span>
                                        </div>
                                        <div className="text-center">
                                            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-secondary" />
                                            <span className="block text-sm font-bold text-gray-800">{assignmentsCount}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Case Studies</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-gray-800">Current Lesson Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700 font-medium">Module: {activeLesson?.module_title || "Not selected"}</span>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700 font-medium">Section: {activeLesson?.section_type === "industry_readiness" ? "Industry Readiness" : "Training"}</span>
                                            </div>
                                            {activeLesson?.assignment_title && (
                                                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100/60">
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700 font-medium">Assignment: {activeLesson.assignment_title}</span>
                                                </div>
                                            )}
                                            {activeLesson?.assignment_description && (
                                                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100/60 md:col-span-2">
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700 font-medium">{activeLesson.assignment_description}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum">
                                    <Accordion type="single" collapsible className="w-full">
                                        {[...(course.training_modules || []), ...(course.industry_readiness_modules || [])].map((module, idx) => (
                                            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-xl mb-3 px-4 overflow-hidden bg-white shadow-sm">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <span className="text-left font-bold text-gray-800">
                                                        {module.title} ({module.section_type === "industry_readiness" ? "Industry" : "Training"})
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2 pb-2">
                                                        {(module.lessons || []).map((lesson, tidx) => (
                                                            <li
                                                                key={tidx}
                                                                className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer group"
                                                                onClick={() => {
                                                                    const selected = allLessons.find((l) => l.id === lesson.id);
                                                                    if (selected) {
                                                                        setActiveLesson(selected);
                                                                    }
                                                                }}
                                                            >
                                                                <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-[#000080]" />
                                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{lesson.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </TabsContent>

                                <TabsContent value="notes">
                                    <div className="p-12 border-2 border-dashed border-gray-100 rounded-xl text-center bg-gray-50/50">
                                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <h4 className="text-lg font-bold text-gray-800">Smart Notes</h4>
                                        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Your personal workspace for tracking key learnings during this lesson.</p>
                                        <Button className="bg-[#000080] hover:bg-secondary">Start Taking Notes</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar - Course Content List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden sticky top-24">
                            <div className="p-6 border-b bg-gray-50/50">
                                <h3 className="text-lg font-bold text-[#000080]">Recorded Sessions</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary" style={{ width: allLessons.length > 0 ? `${Math.round((Math.max(activeLessonIndex, 0) + 1) / allLessons.length * 100)}%` : "0%" }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase">
                                        {allLessons.length > 0 ? `${Math.max(activeLessonIndex, 0) + 1} of ${allLessons.length}` : "0 of 0"}
                                    </span>
                                </div>
                            </div>
                            <div className="max-h-[55vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                                {allLessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => setActiveLesson(lesson)}
                                        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${activeLesson?.id === lesson.id
                                            ? "bg-blue-50 border border-blue-100 shadow-inner"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeLesson?.id === lesson.id
                                            ? "bg-[#000080] text-white shadow-lg shadow-blue-200"
                                            : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {activeLesson?.id === lesson.id ? <PlayCircle className="w-4 h-4 animate-pulse" /> : index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-xs font-bold leading-tight line-clamp-2 ${activeLesson?.id === lesson.id ? "text-[#000080]" : "text-gray-700"}`}>
                                                {lesson.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {lesson.module_title}
                                                </span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">{getLessonBadge(lesson)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {allLessons.length === 0 && (
                                    <div className="p-4 text-sm text-gray-500">No lessons available yet for this course.</div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
