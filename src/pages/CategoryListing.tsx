import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
    Search, ArrowLeft, PlayCircle, Code, Award, Users,
    Layers, Workflow, Blocks, Database, Brain, Globe,
    CheckCircle, Eye, Clock, Monitor, Star
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { categoryConfig, coursesData } from "@/data/categoryCourses";
import { CoursePricing } from "@/components/CoursePricing";
import DemoSidebarCard from "@/components/DemoSidebarCard";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";
import { useStickyParallax } from "@/hooks/useStickyParallax";
import { useRef } from "react";

const CategoryListing = ({ categorySlug }: { categorySlug: string }) => {
    const config = categoryConfig[categorySlug];
    const [searchQuery, setSearchQuery] = useState("");

    // Sticky Parallax Refs
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const sidebarContentRef = useRef<HTMLDivElement>(null);
    const stickyY = useStickyParallax(gridContainerRef, sidebarContentRef);

    if (!config) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Category not found</h2>
                <Button asChild>
                    <Link to="/courses-menu">Browse All Courses</Link>
                </Button>
            </div>
        );
    }

    const filteredCourses = coursesData.filter(course =>
        course.categoryId === categorySlug &&
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const siteUrl = "https://nxgentechacademy.com";
    const pageUrl = `${siteUrl}/courses/${categorySlug}`;

    // SAP BTP Specific Architecture Data (Keep it integrated for uniform look)
    const isBTP = categorySlug === "sap-btp";
    const btpPillars = [
        {
            title: "Application Development",
            icon: Code,
            color: "text-[#000080]",
            bg: "bg-blue-50",
            items: ["SAP Build Apps (Low-Code/No-Code)", "SAP Business Application Studio (Pro-Code)", "Cloud Foundry & Kyma Runtimes", "Mobile Services"]
        },
        {
            title: "Automation",
            icon: Workflow,
            color: "text-orange-600",
            bg: "bg-orange-50",
            items: ["SAP Build Process Automation", "Workflow Management", "RPA (Robotic Process Automation)", "SAP Task Center"]
        },
        {
            title: "Integration",
            icon: Blocks,
            color: "text-green-600",
            bg: "bg-green-50",
            items: ["SAP Integration Suite", "Cloud Integration (CPI)", "API Management", "Advanced Event Mesh"]
        },
        {
            title: "Data & Analytics",
            icon: Database,
            color: "text-amber-600",
            bg: "bg-amber-50",
            items: ["SAP HANA Cloud", "SAP Analytics Cloud (SAC)", "SAP Datasphere", "Master Data Governance"]
        },
        {
            title: "Artificial Intelligence",
            icon: Brain,
            color: "text-purple-600",
            bg: "bg-purple-50",
            items: ["SAP AI Core", "SAP AI Launchpad", "AI Business Services", "Intelligent Scenarios"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-700">
            <Helmet>
                <title>{`${config.title} - ${config.parentCategory} Training in Hyderabad | NxGen Tech Academy`}</title>
                <meta name="description" content={`${config.description} Enroll for the best ${config.parentCategory} training in Hyderabad with 100% placement assistance.`} />
                <link rel="canonical" href={pageUrl} />
            </Helmet>

            <PageHero
                title={config.title}
                description={config.description}
            >
                <Link to="/courses-menu" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Courses
                </Link>
            </PageHero>

            {/* Main Content Layout */}
            <div id="content-area" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 overflow-x-hidden">
                <div ref={gridContainerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN - CONTENT (2/3 width) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* SAP BTP Specific: Architecture Overview */}
                        {isBTP && (
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                                    <Layers className="w-6 h-6 text-[#000080]" /> The SAP BTP Ecosystem
                                </h2>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    SAP Business Technology Platform is the unified environment for innovation.
                                    Our training covers the entire spectrum of pillars defined in the SAP BTP Architecture.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {btpPillars.map((pillar, idx) => (
                                        <div key={idx} className={`border border-gray-100 rounded-xl p-5 ${idx === 4 ? 'md:col-span-2' : ''} hover:shadow-md hover:border-blue-100 transition-all bg-slate-25`}>
                                            <div className="flex items-center gap-3 mb-3 border-b pb-2">
                                                <div className={`p-2 rounded-lg ${pillar.bg}`}>
                                                    <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                                                </div>
                                                <h3 className="font-bold text-gray-800">{pillar.title}</h3>
                                            </div>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {pillar.items.map((item, i) => (
                                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${pillar.color} flex-shrink-0`}></span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-xl font-bold text-[#000080] mb-4">Available Course Modules</h3>
                                </div>
                            </section>
                        )}

                        {/* Search Bar */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder={`Filter ${config.title} modules...`}
                                    className="w-full pl-12 pr-6 py-7 rounded-xl border border-gray-200 shadow-sm text-lg focus:ring-2 focus:ring-[#000080]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                                    >
                                        {/* Image Header */}
                                        <div className="relative h-58 w-full overflow-hidden bg-gray-100">
                                            {course.image && course.image !== "code-icon" ? (
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#000080] to-blue-900 flex items-center justify-center p-8">
                                                    <Code className="w-16 h-16 text-white/20" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#000080] transition-colors">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < (course.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                ))}
                                                <span className="text-gray-400 text-xs ml-2">4.9 (Student Choice)</span>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {course.description || `Comprehensive training on ${course.title} including real-world projects, certified curriculum and placement support.`}
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-3">
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-[#000080]" />
                                                        <span>{course.duration || "40+ hours"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Monitor className="w-4 h-4 text-[#000080]" />
                                                        <span>{course.mode || "Live Training"}</span>
                                                    </div>
                                                </div>

                                                <Button asChild className="w-full bg-[#000080] hover:bg-[#000080]/90 text-white shadow-md">
                                                    <Link to={`/courses/${course.id}`}>
                                                        View Full Details <Eye className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">No matching modules found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search or contact us for custom curriculum requirements.</p>
                                    <Button asChild variant="outline" className="border-[#000080] text-[#000080]">
                                        <Link to="/contact">Get in Touch</Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Outcomes Section */}
                        {config.outcomes && (
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-[#000080] mb-8 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-500" /> Learning Outcomes
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {config.outcomes.map((outcome, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-green-100 transition-colors">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <span className="text-gray-700 leading-relaxed">{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* <CoursePricing courseTitle={config.title} /> */}
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="lg:col-span-1 relative">
                        <motion.div 
                            ref={sidebarContentRef}
                            style={{ y: stickyY }}
                            className="space-y-6 pb-8"
                        >
                            <DemoSidebarCard courseTitle={config.title} />

                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-[#000080] mb-6 flex items-center gap-2 border-b pb-4">
                                    <Star className="w-5 h-5 text-yellow-500" /> Course Perks
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 text-sm text-gray-600 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#000080] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                        <span>Live Sessions & Support</span>
                                    </li>
                                    <li className="flex items-center gap-4 text-sm text-gray-600 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#000080] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Code className="w-5 h-5" />
                                        </div>
                                        <span>Industry Case Studies</span>
                                    </li>
                                    <li className="flex items-center gap-4 text-sm text-gray-600 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#000080] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <span>Recognized Certification</span>
                                    </li>
                                    <li className="flex items-center gap-4 text-sm text-gray-600 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#000080] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <span>Lifetime Alumni Access</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-[#000080] to-blue-900 rounded-2xl text-white shadow-lg text-center">
                                <h4 className="text-xl font-bold mb-4">Still Unsure?</h4>
                                <p className="text-white/80 text-sm mb-6">Connect with our career experts for a free 1-on-1 counseling session to find the right path for you.</p>
                                <Button asChild className="w-full bg-white text-[#000080] hover:bg-gray-100 rounded-lg">
                                    <Link to="/contact">Schedule Call</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryListing;
