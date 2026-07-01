import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { categories, instructors } from "@/data";
import { SEO } from "@/components/SEO";

// Define mentors data
const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    category: "web",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "A seasoned web developer with over 10 years of experience, specializing in React and Vue.js. As a Google Developer Expert, she frequently speaks at tech conferences and mentors aspiring developers.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UI/UX Design Lead",
    category: "web",
    company: "Adobe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "An accomplished UI/UX designer with 8+ years of experience and Adobe certification. Specializes in design systems architecture and leads UX research initiatives, creating intuitive and user-centered designs.",
  },
  {
    id: 3,
    name: "David Kim",
    role: "Flutter Developer",
    category: "mobile",
    company: "Uber",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "A Flutter Google Developer Expert with extensive experience in mobile app architecture. Specializes in cross-platform development and performance optimization, delivering high-quality mobile solutions.",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "iOS Tech Lead",
    category: "mobile",
    company: "Apple",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    description: "A distinguished iOS developer and SwiftUI specialist who has spoken at Apple's WWDC. Her apps have been featured on the App Store, showcasing excellence in iOS development and user experience design.",
  },
  {
    id: 5,
    name: "Alex Turner",
    role: "Backend Architect",
    category: "backend",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop",
    description: "An expert backend architect specializing in Node.js and Express, with AWS Solutions Architect certification. Has extensive experience in designing microservices and building robust system architectures.",
  },
  {
    id: 6,
    name: "Maria Garcia",
    role: "Python Developer",
    category: "backend",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    description: "A Python expert and Django framework specialist who has contributed to Python's core codebase. Excels in database design and API architecture, helping teams build scalable web applications.",
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Data Scientist",
    category: "data",
    company: "Tesla",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    description: "A leading data scientist with expertise in machine learning and AI. Specializes in Python data science, big data analytics, and building predictive models for real-world applications.",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    role: "BI Specialist",
    category: "data",
    company: "Oracle",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    description: "An experienced BI specialist with deep knowledge of Power BI and SQL Server. Creates impactful data visualizations and provides valuable business analytics insights to drive decision-making.",
  },
  {
    id: 9,
    name: "Robert Schmidt",
    role: "SAP ABAP Developer",
    category: "sap",
    company: "SAP",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    description: "A certified SAP ABAP expert with extensive experience in enterprise development. Specializes in SAP systems integration and has successfully delivered numerous large-scale SAP implementations.",
  },
  {
    id: 10,
    name: "Anna Weber",
    role: "SAP HANA Architect",
    category: "sap",
    company: "Deloitte",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    description: "A skilled SAP HANA architect with expertise in data modeling and enterprise architecture. Specializes in cloud integration and has led multiple successful SAP HANA implementations.",
  },
];

const Mentors = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { ref, isVisible } = useScrollAnimation(0.2);

  const filteredMentors = selectedCategory === "all"
    ? instructors
    : instructors.filter(instructor => instructor.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <SEO
        title="Our Mentors - NxGen Tech Academy"
        description="Learn from industry expert mentors with years of real-world experience in leading tech companies at NxGen Tech Academy."
        type="website"
        path="/mentors"
      />

      {/* Hero Section */}
      <PageHero
        title="Learn from Industry Experts"
        description="Our mentors are skilled professionals with years of real-world experience in leading tech companies."
      />

      {/* Filter Section */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-300"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div
            ref={ref}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {filteredMentors.map((mentor, index) => (
              <MentorCard key={mentor.id} mentor={mentor} index={index} />
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No mentors found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Mentor CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Share Your <span className="gradient-text">Expertise?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our team of expert mentors and help shape the future of tech education.
          </p>
          <Button variant="hero" size="lg">
            Become a Mentor
          </Button>
        </div>
      </section>
    </div>
  );
};

import { Instructor } from "@/data/types";

const MentorCard = ({ mentor, index }: { mentor: Instructor; index: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div
      ref={ref}
      className={`group relative bg-card rounded-xl overflow-hidden shadow-md hover-lift transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={mentor.image}
          alt={mentor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Permanent Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <h3 className="text-xl font-bold mb-1 text-white">{mentor.name}</h3>
          <p className="text-white/80">{mentor.role}</p>
          <p className="text-sm text-primary/90 mt-1">{mentor.designation} • {mentor.experience}</p>
        </div>

        {/* Hover Overlay for Description */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <p className="text-white/90 text-base leading-relaxed">
              {mentor.description}
            </p>
          </div>
        </div>
      </div>

      {/* Info Section - Overlay on image */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <h3 className="text-xl font-bold mb-1 text-white">{mentor.name}</h3>
        <p className="text-white/80">{mentor.role}</p>
        <p className="text-sm text-primary/90 mt-1">{mentor.designation} • {mentor.experience}</p>
      </div>
    </div>
  );
};

export default Mentors;