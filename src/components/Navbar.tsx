import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Grid, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

import { categoryConfig, coursesData } from "@/data/categoryCourses";

const courseCategories = (() => {
  // 1. Get unique parent categories ensuring order based on config definition
  const parentCategories = Array.from(
    new Set(Object.values(categoryConfig).map((c) => c.parentCategory)),
  );

  return parentCategories
    .map((parent) => {
      // 2. Get all sub-categories (config entries) for this parent
      const subCats = Object.entries(categoryConfig)
        .filter(([_, config]) => config.parentCategory === parent)
        .map(([key, config]) => ({ key, ...config }));

      let items = [];

      // 3. Logic: If multiple sub-categories, show them. If single, show its courses.
      if (subCats.length > 1) {
        items = subCats.map((sc) => ({
          title: sc.title,
          desc: sc.description,
          link: `/courses/${sc.key}`,
        }));
      } else if (subCats.length === 1) {
        const subCat = subCats[0];
        const courses = coursesData.filter((c) => c.categoryId === subCat.key);
        items = courses.map((c) => ({
          title: c.title,
          desc: c.description || subCat.description,
          link: `/courses/${c.id}`,
        }));
      }

      return {
        category: parent,
        items,
      };
    })
    .filter((c) => c.items.length > 0); // content filter
})();

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(
    courseCategories[0]?.category || "SAP Courses",
  );
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const filtered = coursesData.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCourse = (id: string) => {
    navigate(`/courses/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectCourse(searchResults[0].id);
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const role = localStorage.getItem("role");
  const dashboardPath =
    role === "admin" ? "/admin/dashboard" :
    role === "instructor" ? "/instructor/dashboard" :
    role === "student" ? "/student/dashboard" :
    role === "blog_admin" ? "/blog-admin" :
    "/";
  const isAuthPage = [
    "/student-login",
    "/instructor-login",
    "/register",
    "/login",
  ].includes(location.pathname);
  const isSpecialAccount = role === "student" || role === "instructor";

  // Helper to find active items
  const activeItems =
    courseCategories.find((c) => c.category === activeCategory)?.items || [];

  if (isSpecialAccount || isAuthPage) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b pb-4 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/Logo.png"
                alt="NxGen Tech Academy"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Logout Button - Only show if logged in */}
            {isSpecialAccount && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium px-6"
                onClick={() => {
                  localStorage.removeItem("username");
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b pb-4 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:flex-wrap items-center justify-between gap-2 xl:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/Logo.png"
              alt="NxGen Tech Academy"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Nav Controls - Middle Section */}
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 xl:gap-4 w-full lg:w-auto justify-center lg:justify-start lg:pl-2 xl:pl-8 mt-2 lg:mt-0 min-w-0">
            {/* Hover Course Menu Button & Dropdown - Hidden on Mobile/Tablet */}
            <div className="relative group/menu hidden lg:flex justify-center">
              <Button
                asChild
                className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium px-2 xl:px-6 gap-2 shrink-0 cursor-default"
              >
                <div>
                  <Grid className="w-4 h-4" />
                  Course Menu
                </div>
              </Button>

              {/* Invisible bridge for smooth hover */}
              <div className="absolute top-full left-0 w-full h-4 bg-transparent z-[60]"></div>

              {/* Priority dropdown, shown on hover of group/menu */}
              <div className="absolute top-[calc(100%+0.5rem)] left-0 w-64 bg-white shadow-xl rounded-md opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-[60] py-2 border border-gray-100">
                <ul className="flex flex-col">
                  {[
                    {
                      name: "SAP",
                      link: "/sap-courses",
                      items: [
                        { title: "SAP ABAP on HANA", link: "/courses/sap-abap-on-hana-course-online" },
                        { title: "SAP ABAP on HANA (CDS & OData)", link: "/courses/sap-abap-rap" },
                        { title: "SAP Fiori & UI5", link: "/courses/sap-ui5-fiori-training" },
                        { title: "SAP SD", link: "/courses/sap-sd-course-training" },
                        { title: "SAP MM", link: "/courses/sap-mm-course" },
                        { title: "SAP FICO", link: "/courses/sap-fico-course-training" },
                        { title: "SAP PP", link: "/courses/sap-pp-course" },
                        { title: "SAP BTP For Working Professionals", link: "/courses/sap-btp-working-professionals" },
                        { title: "SAP BTP For Freshers", link: "/courses/sap-btp-freshers" },
                        { title: "SAP CPI Training", link: "/courses/sap-cpi-training" },
                        { title: "SAP QM", link: "/courses/sap-qm-course" },
                        { title: "SAP BASIS S/4HANA", link: "/courses/sap-basis-s4hana-training" },
                      ]
                    },
                    {
                      name: "Python",
                      link: "/courses/python",
                      items: courseCategories.find((c) => c.category === "Python")?.items || []
                    },
                    {
                      name: "AI",
                      link: "/courses/artificial-intelligence-training-hyderabad",
                      items: courseCategories.find((c) => c.category === "AI")?.items || []
                    },
                    {
                      name: "AIML",
                      link: "/courses/aiml-training-hyderabad",
                      items: courseCategories.find((c) => c.category === "AIML")?.items || []
                    },
                    {
                      name: "Data Analytics",
                      link: "/courses/data-analytics-online-training",
                      items: courseCategories.find((c) => c.category === "Data Analytics")?.items || []
                    },
                    {
                      name: "Digital Marketing",
                      link: "/courses/digital-marketing",
                      items: courseCategories.find((c) => c.category === "Digital Marketing")?.items || []
                    }
                  ].map((category) => (
                    <li key={category.name} className="relative group/category px-4 py-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer">
                      <Link to={category.link} className="w-full text-left font-medium text-gray-800">
                        {category.name}
                      </Link>
                      {category.items.length > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}

                      {/* Nested Dropdown */}
                      {category.items.length > 0 && (
                        <div className="absolute left-full top-0 ml-0 w-[600px] bg-[#fdfdfd] shadow-2xl rounded-md opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible transition-all duration-300 z-[70] p-6 border border-gray-100">
                          <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
                            {category.items.map((item, idx) => (
                              <li key={idx}>
                                <Link to={item.link} className="block text-sm text-gray-700 hover:text-[#000080] font-medium transition-colors">
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <Link to={category.link} className="text-[#000080] font-semibold text-sm hover:underline underline-offset-4">
                              View All {category.name} Courses
                            </Link>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-1 w-full xl:max-w-xl relative min-w-0" ref={searchRef}>
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search Your Course Here!"
                  className="w-full h-10 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]/20 transition-all"
                />
                <button
                  onClick={() => searchResults.length > 0 && handleSelectCourse(searchResults[0].id)}
                  className="bg-[#000080] hover:bg-[#000080]/90 text-white w-12 flex items-center justify-center rounded-r-md transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && (searchQuery.length >= 2) && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-fade-in">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-2 max-h-[350px] overflow-y-auto">
                        <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Top Results
                        </div>
                        {searchResults.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => handleSelectCourse(course.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-md transition-all text-left group"
                          >
                            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#000080] transition-colors">
                              <BookOpen className="w-5 h-5 text-[#000080] group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#000080] transition-colors truncate">
                                {course.title}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {course.categoryId.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#000080] transition-transform group-hover:translate-x-1" />
                          </button>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                        <Link
                          to="/all-courses"
                          onClick={() => setIsSearchFocused(false)}
                          className="text-sm font-bold text-[#000080] hover:underline underline-offset-4"
                        >
                          View All Courses
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500">No courses found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Button
              asChild
              className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium px-2 xl:px-6"
            >
              <Link to="/all-courses">Explore All Courses</Link>
            </Button>
            <Button
              asChild
              className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium px-2 xl:px-6"
            >
              <Link to="/about">About Us</Link>
            </Button>
            {/* <Button asChild className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium px-2 xl:px-6">
              <Link to="/blogs">Blogs</Link>
            </Button> */}

            <Button
              asChild
              className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium px-2 xl:px-6"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            {localStorage.getItem("username") ? (
              <>
                <Button
                  asChild
                  className="bg-secondary hover:bg-secondary/90 text-white font-medium px-2 xl:px-6"
                >
                  <Link to={dashboardPath}>Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium px-2 xl:px-6"
                  onClick={() => {
                    localStorage.removeItem("username");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("role");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-medium px-2 xl:px-6"
              >
                <Link to="/register">Register</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white mt-4 space-y-3 px-4 pb-6">
            {/* Courses Accordion for Mobile */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#000080] text-white rounded-md font-medium transition-all"
              >
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Our Courses
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isMobileCoursesOpen ? 'rotate-90' : ''}`} />
              </button>

              {isMobileCoursesOpen && (
                <div className="mt-2 space-y-1 bg-gray-50 rounded-md p-2 overflow-hidden animate-fade-in">
                  {[
                    {
                      name: "SAP",
                      link: "/sap-courses",
                      items: [
                        { title: "SAP ABAP on HANA", link: "/courses/sap-abap-on-hana-course-online" },
                        { title: "SAP ABAP on HANA (CDS & OData)", link: "/courses/sap-abap-rap" },
                        { title: "SAP Fiori & UI5", link: "/courses/sap-ui5-fiori-training" },
                        { title: "SAP SD", link: "/courses/sap-sd-course-training" },
                        { title: "SAP MM", link: "/courses/sap-mm-course" },
                        { title: "SAP FICO", link: "/courses/sap-fico-course-training" },
                        { title: "SAP PP", link: "/courses/sap-pp-course" },
                        { title: "SAP BTP For Working Professionals", link: "/courses/sap-btp-working-professionals" },
                        { title: "SAP BTP For Freshers", link: "/courses/sap-btp-freshers" },
                        { title: "SAP CPI Training", link: "/courses/sap-cpi-training" },
                        { title: "SAP QM", link: "/courses/sap-qm-course" },
                        { title: "SAP BASIS S/4HANA", link: "/courses/sap-basis-s4hana-training" },
                      ]
                    },
                    {
                      name: "Python",
                      link: "/courses/python",
                      items: courseCategories.find((c) => c.category === "Python")?.items || []
                    },
                    {
                      name: "AI",
                      link: "/courses/artificial-intelligence-training-hyderabad",
                      items: courseCategories.find((c) => c.category === "AI")?.items || []
                    },
                    {
                      name: "AIML",
                      link: "/courses/aiml-training-hyderabad",
                      items: courseCategories.find((c) => c.category === "AIML")?.items || []
                    },
                    {
                      name: "Data Analytics",
                      link: "/courses/data-analytics-online-training",
                      items: courseCategories.find((c) => c.category === "Data Analytics")?.items || []
                    },
                    {
                      name: "Digital Marketing",
                      link: "/courses/digital-marketing",
                      items: courseCategories.find((c) => c.category === "Digital Marketing")?.items || []
                    }
                  ].map((category) => (
                    <div key={category.name} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => setExpandedMobileCategory(expandedMobileCategory === category.name ? null : category.name)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#000080]"
                      >
                        {category.name}
                        {category.items.length > 0 && (
                          <ChevronRight className={`w-3 h-3 transition-transform ${expandedMobileCategory === category.name ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      {expandedMobileCategory === category.name && category.items.length > 0 && (
                        <div className="pl-4 pb-2 space-y-1 animate-slide-up">
                          {category.items.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.link}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileCoursesOpen(false);
                              }}
                              className="block py-1 text-sm text-gray-600 hover:text-[#000080]"
                            >
                              {item.title}
                            </Link>
                          ))}
                          <Link
                            to={category.link}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsMobileCoursesOpen(false);
                            }}
                            className="block py-1 text-sm font-bold text-[#000080] hover:underline"
                          >
                            View All {category.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button asChild className="w-full bg-[#000080] text-white">
              <Link to="/all-courses" onClick={() => setIsMobileMenuOpen(false)}>
                Explore All Courses
              </Link>
            </Button>

            <Button asChild className="w-full bg-[#000080] text-white">
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </Link>
            </Button>
            <Button asChild className="w-full bg-[#000080] text-white">
              <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>
                Blogs
              </Link>
            </Button>
            <Button asChild className="w-full bg-[#000080] text-white">
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact Us
              </Link>
            </Button>
            {localStorage.getItem("username") ? (
              <>
                <Button asChild className="w-full bg-secondary text-white">
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                </Button>
                <Button
                  className="w-full bg-red-500 text-white"
                  onClick={() => {
                    localStorage.removeItem("username");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("role");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#000080] text-[#000080]"
                >
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register Now
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                >
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
