import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Smartphone, Clock, Star, ChevronLeft, ChevronRight, Calendar, Database, Sparkles, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { CourseCarousel } from "@/components/CourseCarousel";
import { DemoModal } from "@/components/DemoModal";

const sapCategories = [
  { title: "SAP Technical & Development", hours: "Advanced coding, configuration, and technical architecture modules.", link: "/courses/sap-technical" },
  { title: "SAP Functional Modules", hours: "Finance, Materials Management, Sales & Distribution, and more.", link: "/courses/sap-functional" },
  { title: "SAP Business Technology Platform (BTP)", hours: "Cloud integration and digital transformation modules.", link: "/courses/sap-btp" },
];

const sapCourses = [
  { title: "SAP ABAP on S/4 HANA", duration: "8-10 Weeks", link: "/courses/sap-abap-on-hana-course-online" },
  { title: "SAP ABAP & CDS", duration: "8-10 Weeks", link: "/courses/sap-abap-rap" },
  { title: "SAP FIORI UI5", duration: "40+ Hours", link: "/courses/sap-ui5-fiori-training" },
  { title: "SAP BASIS", duration: "40+ Hours", link: "/courses/sap-basis-s4hana-training" },
  { title: "SAP FICO On S4 HANA", duration: "2-3 Months", link: "/courses/sap-fico-course-training" },
  { title: "SAP SD On S4 HANA", duration: "10-12 Weeks", link: "/courses/sap-sd-course-training" },
  { title: "SAP MM On S4 HANA", duration: "8-10 Weeks", link: "/courses/sap-mm-course" },
  { title: "SAP PP On S4 HANA", duration: "8-10 Weeks", link: "/courses/sap-pp-course" },
  { title: "SAP QM On S4 HANA", duration: "8-10 Weeks", link: "/courses/sap-qm-course" },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Array of hero images
  const heroImages = [
    { src: '/hero-bg-4.png', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdXT8Mx2S5-wBwOrevQ_09OYcvV0oYFFHznNrYg_5RQQ9OBrw/viewform?usp=publish-editor' },
    { src: '/hero-bg-3.png' },
    { src: '/hero-bg-1.jpeg' },
    { src: '/hero-bg-2.jpeg' },
    { src: '/hero-image.jpg' }
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const siteUrl = "https://nxgentechacademy.com";

  return (
    <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden">
      <Helmet>
        <title>Best IT Training Institute in Hyderabad | NxGen Tech Academy</title>
        <meta name="description" content="NxGen Tech Academy is the leading IT training institute in Hyderabad, offering professional courses in SAP, Python, Data Science, and more with 100% placement assistance." />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Best IT Training Institute in Hyderabad | NxGen Tech Academy" />
        <meta property="og:description" content="Join the best IT training institute in Hyderabad for SAP, Python, Data Science, and more. Get 100% placement assistance." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
      </Helmet>

      {/* Upcoming Event Banner */}
      <section className="bg-primary text-white py-3 border-b-2 border-secondary/50 relative overflow-hidden z-20 shadow-md">
        <div className="w-full px-4 md:px-10 lg:px-20 mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 text-center md:text-left flex-1 w-full">
            <div className="inline-flex items-center gap-1.5 bg-secondary text-white font-bold px-3 py-1 rounded text-xs uppercase tracking-wide whitespace-nowrap shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Free Demo
            </div>

            <h2 className="text-sm md:text-base lg:text-lg font-bold flex items-center whitespace-nowrap">
              SAP BTP Masterclass
            </h2>

            <p className="text-white/80 text-xs md:text-sm hidden lg:block truncate max-w-sm xl:max-w-xl">
              Explore SAP Cloud Development & Integration.
            </p>

            <div className="flex items-center justify-center gap-4 text-xs font-medium ml-auto mr-0 md:mr-4 bg-black/10 px-3 md:px-4 py-1.5 rounded-md border border-white/10 whitespace-nowrap">
            <div className="flex items-center gap-1.5 hidden sm:flex">
                <Presentation className="w-3.5 h-3.5 text-secondary" />
                <span>Upcoming Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span>14th Mar 2026</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>10:00 AM IST</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 flex items-center justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdXT8Mx2S5-wBwOrevQ_09OYcvV0oYFFHznNrYg_5RQQ9OBrw/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto block group"
            >
              <Button size="sm" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white font-bold text-sm px-6 rounded shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 h-9">
                BOOK A DEMO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>

        </div>
      </section>

      {/* Hero Section with Carousel */}
      <section className="relative bg-white text-gray-800 py-2 lg:py-4 overflow-hidden">
        <div className="w-full px-4 md:px-10 lg:px-20 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div>
              <p className="text-xl md:text-2xl text-gray-600 font-medium mb-2">Upscale Your Career in IT Industry</p>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-black">
                IT Training Institute in Hyderabad
              </h1>
            </div>

            <p className="text-lg text-gray-600 font-medium">
              SAP | SAS | Data Engineer | Salesforce | Data Science
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2 w-full">
              <Button asChild size="lg" className="bg-[#000080] hover:bg-[#000080]/90 text-white font-medium text-lg px-8 rounded-md w-full sm:w-auto">
                <Link to="/all-courses">Explore Courses</Link>
              </Button>
              <Button
                onClick={() => setIsDemoModalOpen(true)}
                size="lg"
                className="bg-[#000080]/10 text-[#000080] hover:bg-[#000080]/20 border border-[#000080]/30 font-medium text-lg px-8 rounded-md w-full sm:w-auto"
              >
                Book a Free Demo Class
              </Button>
            </div>

            <DemoModal
              isOpen={isDemoModalOpen}
              onClose={() => setIsDemoModalOpen(false)}
            />

            <div className="pt-2">
              <p className="text-base sm:text-lg text-[#000080] leading-snug sm:leading-normal">
                <span className="font-bold text-xl sm:text-2xl block sm:inline mb-1 sm:mb-0">Extensive</span> <span className="opacity-90">experience in the IT Training &amp; Placement Industry</span>
              </p>
              <div className="h-0.5 w-full bg-gray-200 mt-4 max-w-md"></div>
            </div>

            <div className="pt-6">
              <p className="text-gray-600 mb-4 font-medium text-sm sm:text-base">Professionals hired by</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-4 sm:h-6 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" alt="Cognizant" className="h-4 sm:h-6 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png" alt="Accenture" className="h-4 sm:h-6 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" alt="Infosys" className="h-5 sm:h-8 object-contain" />
              </div>
            </div>
          </div>

          {/* Right Image Carousel */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Carousel Container */}
            <div className="relative w-full max-w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] mx-auto lg:mx-0">
              {/* Images */}
              {heroImages.map((image, index) => {
                const imgElement = (
                  <img
                    src={image.src}
                    alt={`Hero slide ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      } ${image.link ? 'cursor-pointer' : ''}`}
                  />
                );

                return (
                  <div key={index}>
                    {image.link ? (
                      <a href={image.link} target="_blank" rel="noopener noreferrer">
                        {imgElement}
                      </a>
                    ) : (
                      imgElement
                    )}
                  </div>
                );
              })}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-[#000080] w-8'
                      : 'bg-primary/50 w-2 hover:bg-primary/50'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">Why Do Professionals Choose Our Institution?</h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Working professionals choose NxGen Tech Academy because we focus on results, relevance, and reliability. We combine academic depth with industry exposure, which strengthens our position among the <b>top software training institutes in Hyderabad with placements.</b>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Expert instructors with 10+ years of industry experience",
              "Industry-relevant certification programs",
              "Hands-on labs and real-time project exposure",
              "100% job placement assistance",
              "Flexible weekend and weekday schedules",
              "Global certification guidance"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-secondary">
                <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <p className="text-lg font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAP Academy Feature */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" alt="Students learning" className="rounded-2xl shadow-xl w-full object-cover h-[400px]" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-sm">Featured Program</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">SAP Academy for Enterprise Solutions</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our <b>SAP Academy for Enterprise Solutions</b> prepares professionals to become SAP Certified Experts. The program combines structured coursework with enterprise-level practical implementation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Qualification: Graduate & Master’s Background in Commerce, Management, IT, Engineering, or related fields.</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Prerequisite: Basic understanding of any programming language.</span>
                </li>
              </ul>
              <Button className="bg-secondary hover:bg-secondary/90 text-white mt-4" asChild>
                <Link to="/all-courses">Explore More <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SAP Courses Grid */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary">SAP Categories</h2>
          <CourseCarousel items={sapCategories} type="category" />
        </div>
      </section> */}

      {/* Trending Courses Grid */}
      <section className="py-20">
        <div className="w-full px-4 md:px-10 lg:px-20 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary">Trending Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Data Analytics", hours: "70 Hours", link: "/courses/power-bi" },
              { title: "Python", hours: "45 Hours", link: "/courses/python" },
              { title: "Digital Marketing", hours: "Multiple Courses", link: "/courses/digital-marketing" },
              { title: "AIML", hours: "80 Hours", link: "/courses/aiml" },
            ].map((course, i) => (
              <Link key={i} to={course.link} className="bg-white border rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200 group-hover:scale-110 transition-transform duration-500"></div>
                  <span className="relative text-gray-800 font-bold text-lg px-4 text-center group-hover:scale-105 transition-transform">{course.title}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {course.hours}
                  </p>
                  <div className="mt-auto text-primary font-bold group-hover:text-secondary flex items-center gap-2 transition-colors">
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
            }
          </div>
        </div>
      </section>

      {/* SAP Courses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary">SAP Courses</h2>
          <CourseCarousel items={sapCourses} type="course" />
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link to="/all-courses">View All SAP Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary/5">
        <div className="w-full px-4 md:px-10 lg:px-20 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">Testimonials</h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600">Hear from our successful students who transformed their careers with NxGen Tech Academy.</p>
          </div>

          {/* Video Testimonials */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 text-primary uppercase tracking-wider">Video Success Stories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {[
                { id: "v1", youtubeId: "AZEZc7j5jDg", title: "" },
                { id: "v2", youtubeId: "Y019HAHgJvc", title: "" },
                { id: "v3", youtubeId: "f8JehiagC40", title: "" },
                { id: "v4", youtubeId: "-pkVqNifeOA", title: "" },
              ].map((video) => (
                <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="relative aspect-[9/16] bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-8 text-primary">Student Experiences</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Bhargavi", text: "I have successfully completed my SAP FICO training from NxGen Tech Academy, which gave me a strong understanding of Financial Accounting and Controlling concepts.", course: "SAP FICO" },
              { name: "Vinod Goud", text: "THIS MONTH I HAVE COMPLETED SAP FICO COURSE. THE TRAINING IS WELL STRUCTURED AND EASY TO UNDERSTAND. COURSE CONTENT PROVIDES HANDS ON PRATICE.", course: "SAP FICO" },
              { name: "Ritik S. Mourya", text: "I have just completed my FullStack DOT NET training from NxGen Tech Academy. The sessions were very helpful and understanding session throughout the training.", course: "FullStack .NET" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm relative hover:shadow-md transition-all">
                <div className="absolute -top-4 left-8 bg-secondary text-white p-2 rounded-full">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-primary">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-secondary">{testimonial.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-20">
        <div className="w-full px-4 md:px-10 lg:px-20 mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary">Recent Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "SAS Certification Course in Canada (North America)", date: "2025-12-12", views: "725" },
              { title: "Get Certified and Advance Your Career with SAS Data & AI Programs", date: "2025-10-06", views: "479" },
              { title: "What is Data Analytics? Types and Benefits Explained", date: "2025-10-06", views: "920" }
            ].map((article, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors"></div>
                  {/* Placeholder for blog image */}
                  <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs rounded shadow">
                    {article.views} Views
                  </div>
                </div>
                <p className="text-xs text-secondary font-bold mb-1">{article.date}</p>
                <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;