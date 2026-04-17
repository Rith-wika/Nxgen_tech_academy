import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EnrollmentForm from "@/components/EnrollmentForm";
import {
    ArrowLeft, Star, Clock, Users, BookOpen,
    CheckCircle, Briefcase, Award, PlayCircle, Code, ChevronDown, IndianRupee, Monitor,
    Layers, Terminal, Brain, PieChart, Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Preloader } from "@/components/Preloader";
import { coursesData, categoryConfig } from "@/data/categoryCourses";
import { getSapCourseContent } from "@/data/sapCoursesContent";
import { detailedCourses } from "@/data/detailedCourses";
import { CoursePricing } from "@/components/CoursePricing";
import DemoSidebarCard from "@/components/DemoSidebarCard";
import { PageHero } from "@/components/PageHero";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useStickyParallax } from "@/hooks/useStickyParallax";
import { useRef } from "react";

const CourseDetail = ({ id: propId }: { id?: string }) => {
    const { id: paramId } = useParams();
    const id = propId || paramId;
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "curriculum">("details");
    const [expandedModule, setExpandedModule] = useState<number | null>(null);
    const [activeSubTab, setActiveSubTab] = useState<"training" | "readiness">("training");

    // Sticky Parallax Refs
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const sidebarContentRef = useRef<HTMLDivElement>(null);
    const stickyY = useStickyParallax(gridContainerRef, sidebarContentRef);

    const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2);

    const toggleModule = (index: number) => {
        setExpandedModule(expandedModule === index ? null : index);
    };

    const basicCourse = coursesData.find(c => c.id === id);

    // Attempt to get specialized SAP content
    const isSapCourse = basicCourse?.categoryId?.toLowerCase().includes("sap") || id?.toLowerCase().includes("sap");
    const sapContent = isSapCourse ? getSapCourseContent(id || "", basicCourse.title || "") : null;

    // Attempt to get detailed course data (for non-SAP or detailed SAP)
    const detailedCourse = id ? detailedCourses[id] : null;

    const initialRelated = basicCourse ? coursesData.filter(c => c.categoryId === basicCourse.categoryId && c.id !== basicCourse.id).slice(0, 10) : [];
    const isFallback = initialRelated.length === 0;
    const relatedCourses = isFallback && basicCourse ? coursesData.filter(c => c.id !== basicCourse.id).slice(0, 10) : initialRelated;

    const parentCategory = basicCourse && categoryConfig[basicCourse.categoryId] && !isFallback
        ? categoryConfig[basicCourse.categoryId].parentCategory
        : "Our Popular Courses";

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    });

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [id]);

    if (!basicCourse) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                <Button asChild>
                    <Link to="/courses-menu">Browse All Courses</Link>
                </Button>
            </div>
        );
    }

    // Merge/Normalize content
    const content = {
        metaTitle: sapContent?.metaTitle || detailedCourse?.metaTitle,
        metaDescription: sapContent?.metaDescription || detailedCourse?.metaDescription,
        whatIs: sapContent?.whatIs || detailedCourse?.overview || basicCourse.description,
        whyCourse: sapContent?.whyCourse || detailedCourse?.whyCourse || (detailedCourse?.audience ? `This course is ideal for ${detailedCourse.audience.join(", ")}.` : ""),
        keyBenefits: sapContent?.keyBenefits || detailedCourse?.outcomes || [],
        whyChooseNxGen: sapContent?.whyChooseNxGen || detailedCourse?.whyChooseNxGen || [
            "Live interactive training sessions",
            "Real-time projects and case studies",
            "Expert trainer guidance",
            "Placement assistance",
            "Affordable course fees"
        ],
        careerOpportunities: sapContent?.careerOpportunities || detailedCourse?.careerOpportunities || [
            `${basicCourse.title} Professional`,
            "Industry Consultant",
            "Solution Architect",
            "Functional Expert"
        ],
        feesAndDuration: sapContent?.feesAndDuration || detailedCourse?.feesAndDuration || `Our ${basicCourse.title} course is designed to be highly affordable while delivering world-class education. For specific fee structures and starting dates, please reach out to our admissions team.`,
        keyTopics: (sapContent?.keyTopics && sapContent.keyTopics.length > 0)
            ? sapContent.keyTopics
            : (detailedCourse?.tools && detailedCourse.tools.length > 0)
                ? detailedCourse.tools.map(t => t.name)
                : (detailedCourse?.curriculum && detailedCourse.curriculum.length > 0)
                    ? detailedCourse.curriculum.slice(0, 6).map(m => (m.module || (m as any).title).replace(/^Module \d+: /, ""))
                    : [
                        "Comprehensive Module Training",
                        "Industry Best Practices",
                        "Real-world Case Studies",
                        "Hands-on System Practice",
                        "Certification Preparation",
                        "Job-ready Skill Development"
                    ],
        curriculum: sapContent?.curriculum || detailedCourse?.curriculum || [
            { module: "Introduction & Fundamentals", topics: ["Overview", "Basic Navigation", "Core Concepts"] },
            { module: "Core Configuration", topics: ["Master Data Setup", "Standard Business Processes"] },
            { module: "Advanced Features", topics: ["Integration Scenarios", "Advanced Customizing"] },
            { module: "Real-time Projects", topics: ["Industry Best Practices", "Live Case Studies"] },
        ],
        faqs: detailedCourse?.faqs || []
    };

    const duration = basicCourse.duration || detailedCourse?.duration || "40+ hours";
    const enrolled = basicCourse.enrolled || "1500+";

    const toggleTabAndScroll = (tab: "details" | "curriculum") => {
        setActiveTab(tab);
        setTimeout(() => {
            document.getElementById('content-area')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const readinessCurriculum = [
        {
            module: "Project Planning & Real-world Implementation",
            topics: [
                "Understanding business requirements and scope",
                "Project timeline and milestone planning",
                "Agile and Waterfall methodologies in ERP projects",
                "Client-facing communication and status reporting"
            ]
        },
        {
            module: "Industry Best Practices & Documentation",
            topics: [
                "Technical and Functional specifications (FS/TS)",
                "Standard operating procedures (SOPs)",
                "Code optimization and performance tuning",
                "Quality assurance and peer reviews"
            ]
        },
        {
            module: "Resume Building & Portfolio Development",
            topics: [
                "Drafting a professional SAP/Tech resume",
                "Highlighting project experience and key skills",
                "Building a strong LinkedIn presence",
                "Preparing for industry-standard profile evaluations"
            ]
        },
        {
            module: "Mock Interviews & Soft Skills",
            topics: [
                "Technical round preparation",
                "Behavioral and scenario-based interview questions",
                "Communication skills for professional meetings",
                "Salary negotiation and job search strategies"
            ]
        }
    ];

    const currentCurriculum = activeSubTab === "training" ? content.curriculum : readinessCurriculum;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Helmet>
                <title>{content.metaTitle || `${basicCourse.title} Training in Hyderabad | NxGen Tech Academy`}</title>
                <meta name="description" content={content.metaDescription || `Master ${basicCourse.title}. 100% placement guarantee, expert-led training.`} />
            </Helmet>

            <Preloader isLoading={isLoading} threshold={800} />

            <PageHero
                title={basicCourse.title}
                description={basicCourse.description || "Master industry tools with certified experts and real-world projects."}
            >
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Link to="/courses-menu" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Courses
                    </Link>

                    {/* <Button
                        onClick={() => toggleTabAndScroll(activeTab === "curriculum" ? "details" : "curriculum")}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        {activeTab === "curriculum" ? "View Details" : "View Course"}
                    </Button> */}
                </div>
            </PageHero>

            <div id="content-area" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 overflow-x-hidden">
                <div ref={gridContainerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Tab Switcher on Page */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("details")}
                                className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${activeTab === "details" ? "border-[#000080] text-[#000080]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Course Details
                            </button>
                            <button
                                onClick={() => setActiveTab("curriculum")}
                                className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${activeTab === "curriculum" ? "border-[#000080] text-[#000080]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Curriculum
                            </button>
                        </div>

                        {activeTab === "curriculum" ? (
                            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
                                {/* Technical/Index Content: Stats, Key Topics, and Curriculum Accordion */}
                                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-3 md:gap-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                        <span className="font-bold text-gray-900 m-0 text-base">{basicCourse.rating || "5.0"}</span>
                                        <span className="text-xs text-gray-500">(Student Reviews)</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="font-medium text-gray-700 m-0 text-base">{duration}</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <span className="font-medium text-gray-700 m-0 text-base">{enrolled} Enrolled</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200 hidden lg:block"></div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-5 h-5 text-green-500" />
                                        <span className="font-bold text-gray-900 m-0 text-base">
                                            {activeSubTab === "training"
                                                ? (basicCourse.price || "₹20,000")
                                                : "₹30,000"}
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-200 hidden lg:block"></div>
                                    <div className="flex items-center gap-2 text-[#000080]">
                                        <Monitor className="w-5 h-5" />
                                        <span className="font-medium m-0 text-base">
                                            {activeSubTab === "training"
                                                ? (basicCourse.mode || "Online / Offline")
                                                : "Offline"}
                                        </span>
                                    </div>
                                </div>

                                {/* Sub-Tabs Switcher for Curriculum */}
                                <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                                    <button
                                        onClick={() => { setActiveSubTab("training"); setExpandedModule(null); }}
                                        className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSubTab === "training" ? "bg-white text-[#000080] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        1. Training
                                    </button>
                                    <button
                                        onClick={() => { setActiveSubTab("readiness"); setExpandedModule(null); }}
                                        className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSubTab === "readiness" ? "bg-white text-[#000080] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        2. Industry Readiness
                                    </button>
                                </div>

                                {content.keyTopics.length > 0 && activeSubTab === "training" && (
                                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                        <h3 className="text-3xl font-bold text-[#000080] mb-8 flex items-center justify-start gap-3">
                                            <BookOpen className="w-8 h-8 text-[#000080]" /> Key Topics Covered
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {content.keyTopics.map((topic, idx) => (
                                                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-3xl font-bold text-[#000080] mb-6 flex items-center justify-start gap-3">
                                        <BookOpen className="w-8 h-8 text-[#000080]" />
                                        {activeSubTab === "training" ? `${basicCourse.title} Comprehensive Modules` : "Industry Readiness Program"}
                                    </h2>
                                    <p className="text-gray-500 mb-8 max-w-2xl">
                                        {activeSubTab === "training"
                                            ? "Explore the comprehensive technical modules designed to master the subject from scratch."
                                            : "Our exclusive program focusing on real-world projects, documentation, and interview preparation to make you job-ready."
                                        }
                                    </p>

                                    <div className="space-y-4">
                                        {currentCurriculum.map((item, index) => {
                                            const isOpen = expandedModule === index;
                                            return (
                                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                    <div
                                                        onClick={() => toggleModule(index)}
                                                        className={`px-6 py-5 flex justify-between items-center cursor-pointer transition-all duration-300 ${isOpen ? 'bg-blue-50 border-b border-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                                                    >
                                                        <p className={`font-bold transition-colors m-0 text-base ${isOpen ? 'text-[#000080]' : 'text-gray-700'}`}>
                                                            Module {index + 1}: {item.module || (item as any).title}
                                                        </p>
                                                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                                        <div className="p-6 bg-white">
                                                            <ul className="grid sm:grid-cols-2 gap-4">
                                                                {item.topics.map((topic, tIdx) => (
                                                                    <li key={tIdx} className="flex items-center gap-3 text-gray-600 group">
                                                                        <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                                                            <PlayCircle className="w-4 h-4" />
                                                                        </div>
                                                                        <span className="text-sm font-medium">{topic}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* <CoursePricing courseTitle={basicCourse.title} /> */}
                                    <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                        <h3 className="text-xl font-bold text-[#000080] mb-4 text-center">Want the full detailed syllabus?</h3>
                                        <p className="text-gray-600 mb-6">Download the complete PDF brochure for {basicCourse.title} with all technical modules and project details.</p>
                                        <Button className="bg-[#000080] hover:bg-[#000080]/90 text-white px-8 h-12 rounded-lg">
                                            Download Brochure
                                        </Button>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                {/* Descriptive/Marketing Content Moved to Details Tab */}
                                {(() => {
                                    const paragraphs = (content.whatIs || "").split(/\n\s*\n/);
                                    const intro = paragraphs.slice(0, 3);
                                    let remaining = paragraphs.slice(3);

                                    // Extract the internal "What is" question if it exists at the start of the remaining text
                                    let subHeading = null;
                                    if (remaining.length > 0) {
                                        const trimmed = remaining[0].trim();
                                        if (trimmed.startsWith("What is")) {
                                            const lines = remaining[0].split('\n');
                                            // Take the first line as a heading if it's a "What is" question
                                            if (lines[0].trim().startsWith("What is")) {
                                                subHeading = lines[0].trim();
                                                if (lines.length > 1) {
                                                    remaining[0] = lines.slice(1).join('\n');
                                                } else {
                                                    remaining = remaining.slice(1);
                                                }
                                            }
                                        }
                                    }

                                    return (
                                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                            {/* Main Section Heading */}
                                            <h2 className="text-3xl font-bold text-[#000080] mb-6 flex items-center justify-start gap-3">
                                                < BookOpen className="w-8 h-8 text-[#000080]" /> Course Overview & Information
                                            </h2>

                                            {/* For FICO, Python and Digital Marketing, move the title heading right after main section heading */}
                                            {(id === "sap-fico-course-training" || id === "python-course-training-hyderabad" || id === "digital-marketing-course-hyderabad" || id === "job-guarantee-digital-marketing-course") && (
                                                <h3 className="text-2xl font-bold text-[#000080] mb-6">
                                                    What is {basicCourse.title}?
                                                </h3>
                                            )}

                                            {/* First 3 paragraphs */}
                                            {intro.map((p, i) => (
                                                <p key={i} className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6">
                                                    {p}
                                                </p>
                                            ))}

                                            {/* For other courses, title heading remains here (after 3rd paragraph) */}
                                            {!(id === "sap-fico-course-training" || id === "python-course-training-hyderabad" || id === "digital-marketing-course-hyderabad" || id === "job-guarantee-digital-marketing-course") && (
                                                <h3 className="text-2xl font-bold text-[#000080] mb-6">
                                                    What is {basicCourse.title}?
                                                </h3>
                                            )}

                                            {/* New heading position: Replace the old position with the specific question from the text */}
                                            {/* {subHeading && (
                                                <h3 className="text-2xl font-bold text-[#000080] mt-10 mb-6">
                                                    {subHeading}
                                                </h3>
                                            )} */}

                                            {/* Remaining paragraphs */}
                                            {remaining.map((p, i) => (
                                                <div key={i} className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6 last:mb-0">
                                                    {p.split('\n').map((line, li) => {
                                                        const trimmed = line.trim();
                                                        const isHeading = (trimmed.endsWith(':') || trimmed.endsWith('?')) && !trimmed.startsWith('•');
                                                        if (isHeading) {
                                                            return <p key={li} className="font-bold text-gray-800 mt-4 mb-2">{line}</p>;
                                                        }
                                                        return <span key={li}>{line}{'\n'}</span>;
                                                    })}
                                                </div>
                                            ))}
                                        </section>
                                    );
                                })()}

                                {content.whyCourse && (() => {
                                    const paragraphs = content.whyCourse.split(/\n\s*\n/);

                                    return (
                                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                            <h3 className="text-3xl font-bold text-[#000080] mb-6 flex items-center justify-start gap-3">
                                                <Star className="w-8 h-8 text-yellow-500" /> Why {basicCourse.title}?
                                            </h3>

                                            {paragraphs.map((p, i) => (
                                                <div key={i} className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6 last:mb-0">
                                                    {p.split('\n').map((line, li) => {
                                                        const trimmed = line.trim();
                                                        const isHeading = (trimmed.endsWith(':') || trimmed.endsWith('?')) && !trimmed.startsWith('•');
                                                        if (isHeading) {
                                                            return <p key={li} className="font-bold text-gray-800 mt-4 mb-2">{line}</p>;
                                                        }
                                                        return <span key={li}>{line}{'\n'}</span>;
                                                    })}
                                                </div>
                                            ))}
                                        </section>
                                    );
                                })()}

                                {content.keyBenefits.length > 0 && (
                                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                        <h3 className="text-3xl font-bold text-[#000080] mb-8 flex items-center justify-start gap-3">
                                            <Award className="w-8 h-8 text-purple-600" /> Key Benefits
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {content.keyBenefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                    <h3 className="text-3xl font-bold text-[#000080] mb-8 flex items-center justify-start gap-3">
                                        <CheckCircle className="w-8 h-8 text-[#10B981]" /> Why Choose NxGen Tech Academy?
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {content.whyChooseNxGen.map((reason, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{reason}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                                    <h3 className="text-3xl font-bold text-[#000080] mb-8 flex items-center justify-start gap-3">
                                        <Briefcase className="w-8 h-8 text-orange-500" /> Career Opportunities
                                    </h3>
                                    <ul className="space-y-4 pl-2">
                                        {content.careerOpportunities.map((career, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                                                <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0"></div>
                                                <span className="text-lg">{career}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>


                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                                    <h3 className="text-3xl font-bold text-[#000080] mb-6 flex items-center justify-start gap-3">
                                        <Clock className="w-8 h-8 text-[#000080]" /> Fees and Duration
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                        {content.feesAndDuration.split('\n').map((line, i) => {
                                            const trimmed = line.trim();
                                            const isHeading = (trimmed.endsWith(':') || trimmed.endsWith('?')) && !trimmed.startsWith('•');
                                            if (isHeading) {
                                                return <p key={i} className="font-bold text-gray-800 mt-4 mb-2">{line}</p>;
                                            }
                                            return <span key={i}>{line}{'\n'}</span>;
                                        })}
                                    </div>
                                    <div className="mt-6 flex flex-wrap items-center gap-4">
                                        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold inline-flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Duration: {duration}
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-[#000080] hover:bg-[#000080]/90 text-white font-bold px-8 h-10 rounded-lg transition-transform hover:-translate-y-1 hover:shadow-lg shadow-md duration-300">
                                                    Enroll Now
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] md:max-w-[550px] bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                                                <DialogHeader className="bg-[#000080] p-6 text-white text-center pb-8 border-b-0 space-y-2">
                                                    <DialogTitle className="text-2xl font-bold flex justify-center text-white m-0">
                                                        Enroll in {basicCourse.title}
                                                    </DialogTitle>
                                                    <p className="text-blue-100 text-sm m-0">Fill in your details to secure your spot</p>
                                                </DialogHeader>
                                                <div className="bg-gray-50/50">
                                                    <EnrollmentForm defaultCourse={basicCourse.title} />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </section>

                                {content.faqs && content.faqs.length > 0 && (
                                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-&lsqb;600ms&rsqb;">
                                        <h3 className="text-3xl font-bold text-[#000080] mb-8 flex items-center justify-start gap-3">
                                            <Award className="w-8 h-8 text-blue-600" /> Frequently Asked Questions
                                        </h3>
                                        <div className="space-y-6">
                                            {content.faqs.map((faq, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <p className="font-bold text-gray-900 text-lg flex gap-2">
                                                        <span className="text-blue-600">{idx + 1}.</span> {faq.question}
                                                    </p>
                                                    <p className="text-gray-600 text-base leading-relaxed pl-6">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky Demo Form) */}
                    <div className="lg:col-span-1 relative">
                        <motion.div
                            ref={sidebarContentRef}
                            style={{ y: stickyY }}
                            className="space-y-6 pb-8"
                        >
                            {/* Sticky Demo Booking Form */}
                            <div className="shadow-lg rounded-2xl overflow-hidden border border-gray-100 bg-white">
                                <DemoSidebarCard courseTitle={basicCourse.title} />
                            </div>

                            {/* Course Highlights Widget */}
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                                <p className="font-bold text-[#000080] mb-4 flex items-center gap-2">
                                    Course Highlights
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <PlayCircle className="w-4 h-4 text-blue-500" /> 50+ Hours Live Sessions
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Code className="w-4 h-4 text-blue-500" /> 10+ Assignments
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Award className="w-4 h-4 text-blue-500" /> Certification Included
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Users className="w-4 h-4 text-blue-500" /> 1:1 Mentorship
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Help */}
                            <div className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-sm text-black font-bold mb-2">Need guidance on {basicCourse.title}?</p>
                                <a href="tel:+91 9701314138" className="text-[#000080] font-bold hover:underline text-lg">
                                    Call Us: +91 9701314138
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Dynamic Related Courses Section */}
            <div className="bg-slate-100 py-16 scroll-mt-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#000080] mb-2 uppercase tracking-wider">Related Courses</h2>
                        <h3 className="text-gray-500 font-medium">More from {parentCategory}</h3>
                        <div className="h-1 w-20 bg-[#000080] mx-auto mt-4 rounded-full"></div>
                    </div>

                    {relatedCourses.length > 0 ? (
                        relatedCourses.length > 3 ? (
                            <div className="relative group">
                                <div className="overflow-hidden" ref={emblaRef}>
                                    <div className="flex touch-pan-y -ml-4">
                                        {relatedCourses.map((course) => (
                                            <div key={course.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4 pb-4">
                                                <Link
                                                    to={`/courses/${course.id}`}
                                                    className="group block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                                                >
                                                    <div className="aspect-video overflow-hidden bg-slate-200">
                                                        <img
                                                            src={course.image}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as any).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="flex text-yellow-500">
                                                                <Star className="w-4 h-4 fill-current" />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#000080] transition-colors line-clamp-1">
                                                            {course.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                            {course.description}
                                                        </p>
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <span className="text-[#000080] font-bold">{course.price}</span>
                                                            <div className="flex items-center text-[#000080] font-bold text-sm">
                                                                View Course <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={scrollPrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#000080] hover:bg-blue-50 transition-all border border-gray-100 hidden md:flex"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#000080] hover:bg-blue-50 transition-all border border-gray-100 hidden md:flex"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                        to={`/courses/${course.id}`}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                                    >
                                        <div className="aspect-video overflow-hidden bg-slate-200">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as any).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                                                }}
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex text-yellow-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#000080] transition-colors line-clamp-1">
                                                {course.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                {course.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="text-[#000080] font-bold">{course.price}</span>
                                                <div className="flex items-center text-[#000080] font-bold text-sm">
                                                    View Course <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 mb-6 font-medium">Check out our other popular categories</p>
                            <Button asChild className="bg-[#000080] hover:bg-blue-900 text-white px-8 rounded-full">
                                <Link to="/courses-menu">Explore Main Courses</Link>
                            </Button>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Button asChild variant="outline" className="border-[#000080] text-[#000080] hover:bg-blue-50 px-8 py-6 rounded-full font-bold">
                            <Link to="/courses-menu">Browse All Courses</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
