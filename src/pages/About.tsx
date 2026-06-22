import React, { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Target, Lightbulb, BookOpen, Briefcase, Award,
  ArrowRight, CheckCircle, MapPin, Phone, Mail, ChevronDown, ChevronUp,
  GraduationCap, Globe, Clock, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/PageHero';
import sriaLogo from '@/assets/sria-logo.png';
import sriaMulugu1 from '@/assets/about/sria-mulugu-1.png';
import sriaMulugu2 from '@/assets/about/sria-mulugu-2.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const coreValues = [
    { icon: <Award className="w-8 h-8 text-[#000080]" />, title: "Excellence", desc: "Delivering consistent academic quality" },
    { icon: <ShieldCheck className="w-8 h-8 text-[#000080]" />, title: "Integrity", desc: "Upholding ethical and transparent practices" },
    { icon: <Lightbulb className="w-8 h-8 text-[#000080]" />, title: "Innovation", desc: "Adopting evolving technologies and methods" },
    { icon: <Users className="w-8 h-8 text-[#000080]" />, title: "Student-Centricity", desc: "Focusing on learner success at every stage" }
  ];

  const keyStrengths = [
    "Industry-aligned training programs",
    "Practical, hands-on learning sessions",
    "Live and real-time project exposure",
    "Internship and career experience opportunities",
    "Resume building and interview readiness",
    "Complete placement assistance"
  ];

  const courses = [
    { title: "Python Programming", path: "/courses/python" },
    { title: "Artificial Intelligence & Machine Learning (AI/ML)", path: "/courses/aiml" },
    { title: "AI", path: "/courses/ai" },
    { title: "Data Analytics", path: "/courses/data-analytics" },
    { title: "SAP", path: "/sap-courses" },
    { title: "Digital Marketing", path: "/courses/digital-marketing" }
  ];

  const faqs = [
    { q: "Is NxGen Tech Academy the best IT training institution in Hyderabad?", a: "Yes. NxGen Tech Academy offers industry-aligned courses, expert mentorship, real-time projects, and strong placement support." },
    { q: "Do the courses include practical training?", a: "Yes. All programs include hands-on sessions and real-world project experience." },
    { q: "Is placement support available?", a: "Yes. We provide resume building, interview preparation, internships, and full placement assistance." },
    { q: "Who can enroll at NxGen Tech Academy?", a: "Students, graduates, and working professionals can join based on course eligibility." }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 overflow-x-hidden">
      <SEO
        title="About Us - NxGen Tech Academy"
        description="NxGen Tech Academy is the best IT training institution in Hyderabad, offering career-driven education in Python, AI/ML, Data Analytics, and Full Stack Development."
        type="website"
        path="/about"
        schemaData={faqSchema}
      />

      <PageHero
        title="Best IT Training Institution in Hyderabad"
        description="Delivering career-driven education that builds skills, confidence, and future-ready professionals."
      />

      {/* Section 2: Who We Are */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-block px-4 py-1 bg-green-50 text-[#000080] rounded-full font-semibold text-sm">
                WHO WE ARE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Journey</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                NxGen Tech Academy was established with one clear goal. We wanted to make quality technical education practical, accessible, and career-focused. What began as a modest coaching initiative steadily transformed into a trusted IT training academy.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Over time, we have supported thousands of learners in achieving academic growth and professional advancement. With more than 15 years of educational experience, we prioritise personalised attention and modern learning techniques.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Today, we blend advanced training tools with a student-first approach, maintaining trust and credibility as the best IT training institution in Hyderabad.
              </p>

            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="NxGen Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#000080]/10 mix-blend-multiply" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border-l-4 border-[#000080] hidden md:block">
                <p className="text-4xl font-bold text-[#000080]">10+</p>
                <p className="text-gray-600 font-medium">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2.5: Brand Introduction */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000080]/5 to-[#22c55e]/5" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#000080]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-xl border border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-[#000080]/10 ring-1 ring-black/5"
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Column: Content */}
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                  <div className="bg-white p-4 rounded-3xl shrink-0 border border-gray-100 shadow-md">
                    <img src={sriaLogo} alt="Sriainfotech Logo" className="w-32 h-auto object-contain" />
                  </div>
                  <div className="text-center sm:text-left pt-1">
                    <h3 className="text-3xl font-bold text-[#000080] mb-4 tracking-tight">NxGenTech Academy</h3>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100 shadow-sm">
                      <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-full animate-pulse shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                      <p className="font-medium text-gray-800 text-sm">
                        Founded by <a href="https://www.sriainfotech.com/" target="_blank" rel="noopener noreferrer" className="text-[#000080] hover:text-[#22c55e] transition-colors hover:underline">Sria Infotech Pvt. Ltd.</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-gray-700">
                  <p className="text-lg leading-relaxed text-gray-800">
                    <strong className="text-gray-900 font-bold">NxGenTech Academy</strong> is a career-oriented IT training institute dedicated to building industry-ready professionals through structured, practical, and performance-driven education.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Founded by <a href="https://www.sriainfotech.com/" target="_blank" rel="noopener noreferrer" ><strong className="text-[#000080] hover:text-[#22c55e] transition-colors font-semibold">Sria Infotech Pvt. Ltd.</strong></a>, our academy functions as a specialized skill development platform designed to prepare students, graduates, and working professionals for modern technology careers.
                  </p>
                </div>
              </div>

              {/* Right Column: Overlapping Images */}
              <div className="relative h-[350px] md:h-[450px] flex items-center justify-center mt-8 lg:mt-0 perspective-1000">
                {/* Back Image */}
                <motion.div
                  initial={{ rotate: 0, x: 0, y: 0 }}
                  whileInView={{ rotate: 6, x: 20, y: 15 }}
                  whileHover={{ rotate: 10, x: 30, y: 5, zIndex: 30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  viewport={{ once: true }}
                  className="absolute w-4/5 md:w-3/4 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 cursor-pointer"
                >
                  <img src={sriaMulugu1} alt="Sria Infotech Plaque Unveiling" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                    <span className="text-white font-medium text-sm md:text-base">Plaque Unveiling</span>
                  </div>
                </motion.div>

                {/* Front Image */}
                <motion.div
                  initial={{ rotate: 0, x: 0, y: 0 }}
                  whileInView={{ rotate: -4, x: -20, y: -15 }}
                  whileHover={{ rotate: -8, x: -30, y: -25, zIndex: 30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  viewport={{ once: true }}
                  className="absolute w-4/5 md:w-3/4 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-20 cursor-pointer"
                >
                  <img src={sriaMulugu2} alt="Sria Infotech Ribbon Cutting Ceremony" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                    <span className="text-white font-medium text-sm md:text-base">Mulugu Branch Inauguration</span>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Mission, Vision & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mission, Vision & Values</h2>
            <div className="w-20 h-1 bg-[#000080] mx-auto rounded-full" />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-t-4 border-[#000080]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-full text-[#000080]">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To offer accessible and high-quality IT education that strengthens knowledge, enhances skills, and builds confidence. We prepare learners to excel professionally and contribute meaningfully to society.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-t-4 border-[#22c55e]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-full text-[#22c55e]">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To emerge as a reliable and innovative learning hub, known for academic excellence, strong student outcomes, and future leadership development.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Core Values</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center group border border-gray-100 hover:border-green-100">
                  <div className="mb-4 inline-flex p-3 bg-gray-50 rounded-full group-hover:bg-green-50 transition-colors">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-500 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: What Makes Us Different */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#000080]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Makes NxGen Tech Academy Different?
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                NxGen Tech Academy goes beyond traditional classroom learning. We align training with real industry expectations and practical outcomes.
              </p>

              <div className="space-y-4">
                {keyStrengths.map((strength, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-[#000080] flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{strength}</span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 text-gray-500 italic">
                Employers value professionals trained at the best IT training institution in Hyderabad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#000080] to-[#22c55e] rounded-2xl transform rotate-3 scale-105 opacity-20 blur-lg" />
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Different Approach"
                className="relative rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section >

      {/* Section 5: Courses We Offer */}
      <section className="py-20 bg-[#f8fafc]" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Courses We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our programs are designed to meet current and emerging industry needs. Each course blends theory, practice, and career support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-[#000080] group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#000080] transition-colors">
                  <BookOpen className="w-6 h-6 text-[#000080] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <Link to={course.path} className="text-[#000080] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 bg-green-50 p-6 rounded-xl max-w-4xl mx-auto">
            <p className="text-gray-700 font-medium">Every course includes structured learning paths, lab sessions, and mentor guidance to ensure job readiness.</p>
          </div>
        </div>
      </section>
      {/* Section 6 & 7: Mentors & Learning Approach - Split View */}
      <section className="py-20 bg-white" >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Mentors */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#000080]" />
                Our Training and Mentors
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our mentors are experienced professionals who bring real-world insights into the classroom. They play a vital role in shaping learner success.
              </p>

              <div className="bg-[#f0f4ff] p-6 rounded-xl">
                <p className="font-bold text-[#000080] mb-4">Why Our Mentors Stand Out</p>
                <ul className="space-y-3">
                  {[
                    "50+ industry-experienced trainers",
                    "Strong corporate and technical exposure",
                    "Student-friendly teaching methods",
                    "Continuous upskilling and industry updates"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="min-w-1.5 min-h-1.5 mt-2 rounded-full bg-[#000080]" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Learning Approach */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-[#000080]" />
                Our Learning Approach
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We follow a practical, skill-based learning framework that supports long-term understanding and career growth.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Concept Clarity", icon: <Lightbulb className="w-5 h-5" /> },
                  { title: "Practical Implementation", icon: <Briefcase className="w-5 h-5" /> },
                  { title: "Industry Use Cases", icon: <Globe className="w-5 h-5" /> },
                  { title: "Job Readiness", icon: <Target className="w-5 h-5" /> },
                  { title: "100% Placements", icon: <Award className="w-5 h-5" /> },
                  { title: "Skill-Readiness Training", icon: <BookOpen className="w-5 h-5" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm flex items-center gap-3 hover:border-[#000080] hover:shadow-md transition-all">
                    <div className="p-2 bg-green-50 rounded-full text-[#000080]">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section >

      {/* Section 8: Why Choose Us (Stats) */}
      <section className="py-20 bg-[#000080] text-white overflow-hidden relative" >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose NxGen Tech Academy</h2>
            <p className="text-green-100 max-w-2xl mx-auto text-lg">Learners trust us for consistency, outcomes, and long-term support.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-sm md:text-base text-green-200 uppercase tracking-widest font-medium">Years Excellence</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-sm md:text-base text-green-200 uppercase tracking-widest font-medium">Students Trained</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-sm md:text-base text-green-200 uppercase tracking-widest font-medium">Success Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-sm md:text-base text-green-200 uppercase tracking-widest font-medium">Expert Faculty</div>
            </motion.div>
          </div>
        </div>
      </section >

      {/* Section 10: FAQs */}
      <section className="py-20 bg-white" >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-[#000080] mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5 text-[#000080]" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white px-5 border-t border-gray-200 overflow-hidden"
                    >
                      <div className="py-4 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

    </div >
  );
};

export default About;
