import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { coursesData } from "@/data/categoryCourses";
import { Eye, Clock, Monitor, Star, Users } from "lucide-react";

const SAPCategory = () => {
    // List of exact course IDs the user wants in this SAP Course page
    const sapCourseIds = [
        "sap-abap-course-training",
        "sap-abap-cds-course-training",
        "sap-fiori-course-training",
        "sap-sd-course-training",
        "sap-mm-course-training",
        "sap-fico-course-training",
        "sap-pp-course-training",
        "sap-btp-professionals-course-training",
        "sap-btp-freshers-course-training",
        "sap-cpi-course-training",
        "sap-qm-course-training",
        "sap-basis-course-training",
    ];

    // Filter the coursesData to only include these courses, in the order specified
    const displayCourses = sapCourseIds
        .map(id => coursesData.find(c => c.id === id))
        .filter(c => c !== undefined);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            <SEO
                title="SAP Certification Courses | NxGen Tech Academy"
                description="SAP Certification Courses at NxGen Tech Academy with expert-led training in SAP ABAP, Fiori, SD, MM, FICO, BTP and more. Learn with real-time projects and placement support."
                type="website"
                path="/courses/sap-courses"
            />

            <PageHero
                title="SAP Courses"
                description="Master top SAP modules and accelerate your career with practical, expert-led training."
            />

            <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
                        Comprehensive SAP Training & Certification
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Accelerate your SAP career by choosing from our wide range of technical and functional modules.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                    {displayCourses.map((course) => (
                        <div
                            key={course!.id}
                            className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Section */}
                            {course!.image && course!.image !== "code-icon" ? (
                                <div className="w-full h-48 bg-gray-50 border-b border-gray-100 flex-shrink-0 overflow-hidden">
                                    <img src={course!.image} alt={course!.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center border-b border-gray-100 flex-shrink-0">
                                    <img src="/Logo.png" alt={course!.title} className="h-16 opacity-50" />
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                        {course!.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-blue-500 text-sm ml-2 m-0">(33 Reviews)</span>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {course!.description || `Comprehensive training on ${course!.title} including real-world projects and certification.`}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 mb-6 border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span>Duration: {course!.duration || "40+ hours"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Users className="w-4 h-4 text-green-600" />
                                        <span>Students Enrolled: {course!.enrolled || "1500+"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Monitor className="w-4 h-4 text-green-600" />
                                        <span>Mode: {course!.mode || "Online"}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex justify-end">
                                    <Button asChild className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-2 rounded-md px-6 shadow-md">
                                        <Link to={`/courses/${course!.id}`}>
                                            <Eye className="w-4 h-4" /> View Course
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SAPCategory;
