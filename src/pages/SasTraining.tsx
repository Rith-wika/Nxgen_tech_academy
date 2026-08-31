import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin, Monitor, Users, BookOpen, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import DemoSidebarCard from "@/components/DemoSidebarCard";

const SasTraining = () => {
    return (
        <div className="min-h-screen font-sans">
            <SEO
                title="SAS Training Institute in Hyderabad | SAS Certification Course"
                description="Best SAS Training Institute in Hyderabad. Learn SAS Programming, Clinical Data Management, and more with 100% placement."
                type="website"
                path="/sas-training-institute-in-Hyderabad"
            />

            <PageHero
                title="SAS Training in Hyderabad Maharashtra"
                description="Best SAS Training Institute in Hyderabad. Learn SAS Programming, Clinical Data Management, and more with 100% placement."
            >
                <div className="flex flex-wrap gap-2 text-sm text-white/80">
                    <span>Home</span> / <span>All Programs</span> / <span>SAS Courses</span> / <span className="text-secondary font-bold">SAS Training Institute in Hyderabad</span>
                </div>
            </PageHero>

            <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* About Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary border-b pb-2 border-gray-200">About SAS Course in Hyderabad</h2>
                            <p className="text-gray-700 leading-relaxed">
                                SAS (Statistical Analysis System) is a command-driven software package used for statistical analysis and data visualization. It is widely used in Clinical Research, Finance, Banking, and other industries for data management and advanced analytics. Our SAS training in Hyderabad is designed to help you master SAS programming and analytics to kickstart your career.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                NxGen Tech Academy offers the best SAS training in Hyderabad with expert trainers who have 10+ years of industry experience. We provide 100% placement assistance, hands-on projects, and certification guidance.
                            </p>
                        </section>

                        {/* What You Will Learn */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary border-b pb-2 border-gray-200">What You Will Learn</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Master SAS Base Programming fundamentals",
                                    "Advanced SAS Macros & SQL for data manipulation",
                                    "Clinical Data Management (CDM) concepts",
                                    "CDISC Standards (SDTM, ADaM) implementation",
                                    "Statistical Analysis & Reporting using SAS",
                                    "Data Visualization with SAS Visual Analytics"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Highlights */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex items-start gap-4">
                                <Clock className="w-8 h-8 text-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Duration</h3>
                                    <p className="text-gray-600">3-4 Months (Weekend/Weekday batches available)</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex items-start gap-4">
                                <Monitor className="w-8 h-8 text-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Mode</h3>
                                    <p className="text-gray-600">Classroom & Online Training</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex items-start gap-4">
                                <Users className="w-8 h-8 text-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Audience</h3>
                                    <p className="text-gray-600">Freshers, Any Graduate, IT Professionals</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex items-start gap-4">
                                <Star className="w-8 h-8 text-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Certification</h3>
                                    <p className="text-gray-600">Guidance for Global SAS Certification</p>
                                </div>
                            </div>
                        </section>

                        {/* Why Learn SAS */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary border-b pb-2 border-gray-200">Why Learn SAS?</h2>
                            <ul className="grid gap-3">
                                {[
                                    "High demand in Clinical Research & Banking sectors",
                                    "Excellent salary packages for SAS professionals",
                                    "Easy to learn compared to other programming languages",
                                    "Global recognition and career growth",
                                    "Versatile application in Data Science and Analytics"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Curriculum Preview (Accordion style placeholder) */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-primary border-b pb-2 border-gray-200">Course Curriculum</h2>
                            <div className="space-y-4">
                                {["SAS Base Programming", "SAS Advanced Programming", "SAS Clinical / CDISC", "SAS Visual Analytics", "Real-time Project Work"].map((module, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-center font-semibold text-gray-800 group-hover:text-primary">
                                            <span>Module {i + 1}: {module}</span>
                                            <span className="text-secondary">+</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-8 sticky top-24 self-start">
                        <DemoSidebarCard courseTitle="SAS Training" />

                        {/* Related Courses */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4 text-primary">Related Courses</h3>
                            <div className="space-y-3">
                                {[/* "Data Analytics", */ "Python Data Science", "Power BI Training", "Clinical Data Management"].map((course, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-700 hover:text-secondary cursor-pointer border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SasTraining;
