import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, PlayCircle, Code, Award, Users, Bot, BrainCircuit, Cpu, Zap, CheckCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";

import { categoryConfig, coursesData } from "@/data/categoryCourses";
import { detailedCourses } from "@/data/detailedCourses";
import { CoursePricing } from "@/components/CoursePricing";
import DemoSidebarCard from "@/components/DemoSidebarCard";

const AICourse = () => {
    const categorySlug = "ai";
    const config = categoryConfig[categorySlug];
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = coursesData.filter(course =>
        course.categoryId === categorySlug &&
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            <SEO
                title={`${config.title} - NxGen Tech Academy`}
                description={config.description}
                type="website"
                path={`/courses/${categorySlug}`}
            />

            <PageHero
                title={config.title}
                description={config.description}
            >
                <Link to="/courses-menu" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Courses
                </Link>
            </PageHero>

            {/* Main Content Layout */}
            <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - CONTENT (2/3 width) */}
                    <div className="lg:col-span-2">

                        {/* Search */}
                        <div className="flex justify-center mb-10">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder={`Search ${config.title}...`}
                                    className="w-full pl-6 pr-12 py-6 rounded-full border border-gray-300 shadow-sm text-lg focus:ring-2 focus:ring-[#000080]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                {course.title}
                                            </h3>
                                        </div>

                                        <div className="w-full h-px bg-gray-200 mb-4"></div>

                                        <div className="flex-grow">
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {course.description || `Comprehensive training on ${course.title} including real-world projects and certification.`}
                                            </p>
                                        </div>

                                        {detailedCourses[course.id] && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Button asChild className="w-full bg-[#000080] hover:bg-[#000080]/90">
                                                    <Link to={`/courses/${course.id}`}>Know More</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    <p className="text-xl">No courses found.</p>
                                </div>
                            )}
                        </div>

                        {/* What You Will Learn Section */}
                        {config.outcomes && (
                            <div className="mt-12 mb-12">
                                <h2 className="text-2xl font-bold text-[#000080] mb-6">What You Will Learn</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {config.outcomes.map((outcome, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Pricing Section */}

                    </div>

                    {/* RIGHT COLUMN - SIDEBAR (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6 self-start">

                            {/* Demo Card */}
                            <DemoSidebarCard courseTitle="AI" />

                            {/* Course Highlights Card */}
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <p className="font-bold text-[#000080] mb-4">Course Highlights</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <PlayCircle className="w-4 h-4 text-blue-500" /> 100+ Hours Live Sessions
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Code className="w-4 h-4 text-blue-500" /> 15+ Industry Projects
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Award className="w-4 h-4 text-blue-500" /> Global Certification
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-700">
                                        <Users className="w-4 h-4 text-blue-500" /> Career Support
                                    </li>
                                </ul>
                            </div>

                            {/* Need Help? */}
                            <div className="text-center p-4">
                                <p className="text-sm text-gray-500">Have questions?</p>
                                <a href="tel:+919960935600" className="text-[#000080] font-bold hover:underline">Call Us: +91 9960 935 600</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICourse;
