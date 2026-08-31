import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Search, ArrowLeft, Star, Clock, Users, Monitor, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { coursesData, categoryConfig } from "@/data/categoryCourses";
import { PageHero } from "@/components/PageHero";

const AllCourses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "All Courses";
    const initialSubCategory = searchParams.get("sub") || null;

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(initialSubCategory);

    // Sync state if URL param changes
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        const subParam = searchParams.get("sub");
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
        setSelectedSubCategoryId(subParam);
        window.scrollTo(0, 0);
    }, [searchParams]);

    const [searchQuery, setSearchQuery] = useState("");

    const handleSubCategorySelect = (subId: string) => {
        setSelectedSubCategoryId(subId);
        setSearchParams({ category: selectedCategory, sub: subId });
    };

    const handleBackToCategories = () => {
        setSelectedSubCategoryId(null);
        setSearchParams({ category: selectedCategory });
    };

    const filteredCourses = coursesData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedSubCategoryId) {
            return matchesSearch && course.categoryId === selectedSubCategoryId;
        }

        const parentCategory = categoryConfig[course.categoryId]?.parentCategory || "Other";
        const matchesCategory = selectedCategory === "All Courses" || parentCategory === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            <SEO
                title="Our Training Programs | NxGen Tech Academy"
                description="Discover industry-leading courses designed to build practical, job-ready skills."
                type="website"
                path="/our-training-programs"
            />

            <PageHero
                title={selectedSubCategoryId ? categoryConfig[selectedSubCategoryId]?.title : "Explore Our Courses"}
                description={selectedSubCategoryId ? categoryConfig[selectedSubCategoryId]?.description : "Discover industry-leading courses designed to build practical, job-ready skills."}
            >
                {selectedSubCategoryId && (
                    <button
                        onClick={handleBackToCategories}
                        className="inline-flex items-center text-white/80 hover:text-white transition-colors mt-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
                    </button>
                )}
            </PageHero>

            <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-2xl">
                        <Input
                            type="text"
                            placeholder="Search your course..."
                            className="w-full pl-6 pr-12 py-7 rounded-full border border-gray-200 shadow-sm text-lg focus:ring-2 focus:ring-[#000080] placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar - Categories */}
                    <div className="w-full lg:w-64 shrink-0">
                        <h2 className="text-xl font-medium text-gray-800 mb-6">Categories</h2>
                        <div className="flex flex-col space-y-3">
                            {categoriesList.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSearchParams({ category });
                                        setSelectedSubCategoryId(null);
                                    }}
                                    className={`py-3.5 px-6 rounded-md border text-left transition-all duration-200 font-medium ${selectedCategory === category
                                        ? "bg-[#000080] text-white border-[#000080] shadow-md"
                                        : "bg-white text-[#000080] border-[#000080] hover:bg-gray-50"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(() => {
                                if (selectedSubCategoryId) {
                                    if (filteredCourses.length === 0) {
                                        return (
                                            <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-2xl">
                                                <p className="text-xl">No courses found in this category.</p>
                                                <Button onClick={handleBackToCategories} variant="link" className="mt-2 text-[#000080] text-lg">
                                                    Back to categories
                                                </Button>
                                            </div>
                                        );
                                    }

                                    return filteredCourses.map((course) => {
                                        const hasValidImage = course.image && course.image !== "code-icon" && !course.image.includes("placeholder.com");
                                        const tempImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

                                        return (
                                            <div
                                                key={course.id}
                                                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                                            >
                                                <div className="w-full aspect-video bg-gray-50 overflow-hidden shrink-0">
                                                    <img
                                                        src={hasValidImage ? course.image : tempImage}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>

                                                <div className="p-7 flex flex-col flex-grow">
                                                    <div className="flex items-center gap-1 mb-4">
                                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-bold text-gray-900 ml-1">{course.rating || 5}</span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                                            {course.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex-grow">
                                                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                                            {course.description || `Comprehensive training on ${course.title} including real-world projects and certification.`}
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto flex justify-end">
                                                        <Button asChild className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-2 rounded-md px-6 py-2 h-10 text-sm font-medium transition-colors">
                                                            <Link to={`/courses/${course.id}`}>
                                                                View Course <ArrowRight className="w-4 h-4 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                }

                                // Default Category Selection View
                                let displayList: any[] = [];
                                if (selectedCategory === "All Courses") {
                                    displayList = filteredCourses.map(course => ({ type: 'course', id: course.id, ...course }));
                                } else {
                                    const subCategories = Object.entries(categoryConfig)
                                        .filter(([_, config]) => config.parentCategory === selectedCategory)
                                        .map(([key, config]) => ({ type: 'category', id: key, ...config }));

                                    if (subCategories.length > 1) {
                                        displayList = searchQuery
                                            ? subCategories.filter(cat => cat.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                            : subCategories;
                                    } else {
                                        displayList = filteredCourses.map(course => ({ type: 'course', id: course.id, ...course }));
                                    }
                                }

                                if (displayList.length === 0) {
                                    return (
                                        <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-2xl">
                                            <p className="text-xl">No courses found matching your criteria.</p>
                                            <Button asChild variant="link" className="mt-2 text-[#000080] text-lg">
                                                <Link to="/contact-us">Contact us for custom requirements</Link>
                                            </Button>
                                        </div>
                                    );
                                }

                                return displayList.map((item) => {
                                    const isSubCat = item.type === 'category';
                                    const desc = isSubCat
                                        ? item.description
                                        : item.description || `Comprehensive training on ${item.title} including real-world projects and certification.`;

                                    const hasValidImage = item.image && item.image !== "code-icon" && !item.image.includes("placeholder.com");
                                    const tempImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                                        >
                                            {!isSubCat && (
                                                <div className="w-full aspect-video bg-gray-50 overflow-hidden shrink-0">
                                                    <img
                                                        src={hasValidImage ? item.image : tempImage}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-7 flex flex-col flex-grow">
                                                {!isSubCat && (
                                                    <div className="flex items-center gap-1 mb-4">
                                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-bold text-gray-900 ml-1">{item.rating || 5}</span>
                                                    </div>
                                                )}

                                                <div className="mb-3">
                                                    <h3 className={`font-bold text-gray-900 leading-tight ${!isSubCat ? 'text-2xl' : 'text-xl'}`}>
                                                        {item.title}
                                                    </h3>
                                                </div>

                                                {isSubCat && <div className="w-full h-px bg-gray-100 mt-2 mb-4"></div>}

                                                <div className="flex-grow">
                                                    <p className={`text-gray-500 text-sm leading-relaxed ${!isSubCat ? 'mb-8' : ''}`}>
                                                        {desc}
                                                    </p>
                                                </div>

                                                <div className={`mt-auto flex items-center ${isSubCat ? 'justify-between pt-6 border-t border-gray-100 mt-6' : 'justify-end'}`}>
                                                    {isSubCat ? (
                                                        <button
                                                            onClick={() => handleSubCategorySelect(item.id)}
                                                            className="text-[#000080] text-base hover:text-blue-700 font-bold flex items-center gap-2"
                                                        >
                                                            Explore Category <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <Button asChild className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-2 rounded-md px-6 py-2 h-10 text-sm font-medium transition-colors">
                                                            <Link to={`/courses/${item.id}`}>
                                                                View Course <ArrowRight className="w-4 h-4 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for unique categories list (need to move it or recalculate it inside)
const parentCategories = Array.from(new Set(Object.values(categoryConfig).map(c => c.parentCategory)));
const categoriesList = ["All Courses", ...parentCategories];

export default AllCourses;