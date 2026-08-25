import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { AnimatedCarousel } from "@/components/AnimatedCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { SEO } from "@/components/SEO";
import {
  BookOpen,
  Users,
  Award,
  Laptop,
  GraduationCap,
  Target,
  Building2,
  Clock,
  Globe2,
  Trophy
} from "lucide-react";

const highlights = [
  {
    icon: Target,
    title: "Industry-Relevant Curriculum",
    description: "Learn from updated courses designed by experts with real-world applications"
  },
  {
    icon: Users,
    title: "Expert Mentors",
    description: "Guided by professionals with 7+ years of industry experience"
  },
  {
    icon: GraduationCap,
    title: "Placement Assistance",
    description: "Job-oriented programs with dedicated career support and guidance"
  },
  {
    icon: Laptop,
    title: "Hands-On Projects",
    description: "Work on live, real-world projects that matter"
  },
  {
    icon: Clock,
    title: "Flexible Learning Modes",
    description: "Choose from online, offline, or hybrid learning options"
  },
  {
    icon: Award,
    title: "Recognized Certification",
    description: "Industry-recognized certificates valued by top employers"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote: "Thanks to NxGen, I landed my first tech job in just 3 months! The practical approach and mentor support made all the difference."
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    quote: "The curriculum is so well-structured and current. I learned more in 6 months here than in my entire college program."
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    quote: "The project-based learning approach gave me a portfolio that impressed employers. Highly recommended!"
  },
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote: "Thanks to NxGen, I landed my first tech job in just 3 months! The practical approach and mentor support made all the difference."
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Students Trained" },
  { icon: Building2, value: "50+", label: "Corporate Partners" },
  { icon: Trophy, value: "90%", label: "Placement Success" },
  { icon: Globe2, value: "5+", label: "Years of Excellence" }
];

const WhyChooseUs = () => {
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollAnimation(0);
  const { ref: highlightsRef, isVisible: isHighlightsVisible } = useScrollAnimation(0.1);
  const { ref: testimonialsRef, isVisible: isTestimonialsVisible } = useScrollAnimation(0.1);
  const { ref: statsRef, isVisible: isStatsVisible } = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen">
      <SEO
        title="Why Choose NxGen Tech Academy"
        description="Empowering learners with real-world skills for a digital future. Discover why NxGen Tech Academy is the right choice for your career."
        type="website"
        path="/why-choose-us"
      />

      {/* Hero Section */}
      <PageHero
        title="Why Choose NxGen?"
        description="Empowering learners with real-world skills for a digital future"
      />
      {/* Key Highlights Section */}
      <section className="py-20 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students <span className="gradient-text">Choose Us</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a community of learners and achieve your career goals with our industry-leading programs
            </p>
          </div>
          <div
            ref={highlightsRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${isHighlightsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <highlight.icon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_35%)] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Student Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our graduates who have transformed their careers through our programs
            </p>
          </div>
          <div
            ref={testimonialsRef}
            className={`transition-all duration-700 ${isTestimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Students Learning"
                  className="w-full object-cover"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-xl font-bold">95%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6">
                What Makes Us <span className="gradient-text">Different</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Industry-Aligned Learning",
                    description: "Our curriculum is designed with input from industry leaders to ensure you learn what matters.",
                    progress: 95
                  },
                  {
                    title: "Practical Experience",
                    description: "Work on real projects using the latest tools and technologies used in the industry.",
                    progress: 90
                  },
                  {
                    title: "Career Support",
                    description: "Get personalized career guidance, interview preparation, and job placement assistance.",
                    progress: 85
                  }
                ].map((item, index) => (
                  <div key={item.title} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="h-2 rounded-full bg-muted-foreground/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                        style={{
                          width: `${item.progress}%`,
                          transitionDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-primary/60 to-secondary/60">
        <div className="container mx-auto px-4">
          <div
            ref={statsRef}
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${isStatsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with us.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="default" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact-us">Talk to an Advisor</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.9/5 from 1000+ reviews
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;