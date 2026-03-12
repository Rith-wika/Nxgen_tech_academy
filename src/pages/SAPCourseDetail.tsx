import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Star, Clock, Users, BookOpen,
    CheckCircle, Briefcase, Award, PlayCircle, Code, ChevronDown
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Preloader } from "@/components/Preloader";
import { coursesData } from "@/data/categoryCourses";
import { getSapCourseContent } from "@/data/sapCoursesContent";
import { CoursePricing } from "@/components/CoursePricing";
import DemoSidebarCard from "@/components/DemoSidebarCard";
import { PageHero } from "@/components/PageHero";
import { Helmet } from "react-helmet-async";

const SAPCourseDetail = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "curriculum">("curriculum");
    const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.2);

    const basicCourse = coursesData.find(c => c.id === id);
    const content = basicCourse ? getSapCourseContent(id || "", basicCourse.title) : null;

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [id]);

    if (!basicCourse || !content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                <Button asChild>
                    <Link to="/courses-menu">Browse All Courses</Link>
                </Button>
            </div>
        );
    }

    const duration = basicCourse.duration || "40+ hours";
    const enrolled = basicCourse.enrolled || "1500+";

    // Curriculum Data
    const actualCurriculum = content?.curriculum || [
        { title: "Introduction & Fundamentals", topics: ["Overview of the module", "System Landscape", "Basic Navigation", "Core Concepts"] },
        { title: "Standard Configuration", topics: ["Organizational Units", "Master Data Setup", "Standard Business Processes", "Customizing Basics"] },
        { title: "Advanced Features & Tools", topics: ["Reporting Tools", "Integration Scenarios", "Advanced Customizing", "Performance Tuning"] },
        { title: "Real-time Projects & Case Studies", topics: ["Industry Best Practices", "Live Project Scenarios", "User Acceptance Testing (UAT)", "Go-Live Support"] },
    ];

    const toggleTabAndScroll = (tab: "details" | "curriculum") => {
        setActiveTab(tab);
        setTimeout(() => {
            document.getElementById('content-area')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Helmet>
                <title>{content.metaTitle || `${basicCourse.title} Training in Hyderabad | NxGen Tech Academy`}</title>
                <meta name="description" content={content.metaDescription || `Master ${basicCourse.title}. 100% placement guarantee, expert-led training.`} />
            </Helmet>

            <Preloader isLoading={isLoading} threshold={800} />

            <PageHero
                title={basicCourse.title}
                description={basicCourse.description || "Master SAP tools with certified experts and real-world projects."}
            >
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Link to="/courses-menu" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Courses
                    </Link>

                    <Button
                        onClick={() => toggleTabAndScroll(activeTab === "curriculum" ? "details" : "curriculum")}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        {activeTab === "curriculum" ? "View Details" : "View Course"}
                    </Button>
                </div>
            </PageHero>

            <div id="content-area" className="w-full px-4 sm:px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

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
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-6 text-gray-600">
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
                                </div>

                                {content.keyTopics && (
                                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                        <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                            <BookOpen className="w-6 h-6 text-blue-500" /> Key Topics Covered
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
                                    <h2 className="text-2xl font-bold text-[#000080] mb-8 flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-blue-600" /> {basicCourse.title} Comprehensive Technical Curriculum
                                    </h2>

                                    <div className="space-y-4">
                                        {actualCurriculum.map((item: any, index: number) => (
                                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <p className="font-bold text-[#000080] text-base m-0">Module {index + 1}: {item.title || item.module}</p>
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div className="p-6 bg-white">
                                                    <ul className="grid sm:grid-cols-2 gap-4">
                                                        {item.topics.map((topic, tIdx) => (
                                                            <li key={tIdx} className="flex items-center gap-3 text-gray-600">
                                                                <PlayCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                                <span>{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* <CoursePricing courseTitle={basicCourse.title} /> */}
                                    <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                        <h3 className="text-xl font-bold text-[#000080] mb-4">Want the full detailed syllabus?</h3>
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
                                            <h2 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                                <BookOpen className="w-6 h-6 text-blue-600" /> Course Overview & Information
                                            </h2>

                                            {/* First 3 paragraphs */}
                                            {intro.map((p, i) => (
                                                <p key={i} className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6">
                                                    {p}
                                                </p>
                                            ))}

                                            {/* Title Heading */}
                                            <h3 className="text-xl font-bold text-[#000080] mb-6">
                                                What is {basicCourse.title}?
                                            </h3>

                                            {/* Dynamic sub-heading from text */}
                                            {/* {subHeading && (
                                                <h3 className="text-xl font-bold text-[#000080] mt-10 mb-6">
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
                                            <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-3">
                                                <Star className="w-6 h-6 text-yellow-500" /> Why {basicCourse.title}?
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

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-purple-600" /> Key Benefits
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

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-6 h-6 text-[#10B981]" /> Why Choose NXGen {basicCourse.title}
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

                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                        <Briefcase className="w-6 h-6 text-orange-500" /> Career Opportunities After {basicCourse.title} Course
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


                                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <h3 className="text-2xl font-bold text-[#000080] mb-4 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-blue-600" /> {basicCourse.title} Course Fees and Duration
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
                                    <div className="mt-6 flex gap-4">
                                        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold inline-flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Duration: {duration}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky Demo Form) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 self-start pb-8">

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
                                <p className="text-sm text-gray-500 mb-2">Need guidance on {basicCourse.title}?</p>
                                <a href="tel:+919960935600" className="text-[#000080] font-bold hover:underline text-lg">
                                    Call Us: +91 9960 935 600
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SAPCourseDetail;
