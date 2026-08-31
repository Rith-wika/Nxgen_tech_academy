import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Award, ArrowRight, ShieldCheck, GraduationCap, Briefcase, Users, CheckCircle,
  Laptop, BookOpen, Sparkles, Brain, Code2, Cloud, Network, Radio, Cpu,
  MapPin, Phone, Mail, Globe,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const whatWeOffer = [
  {
    icon: Laptop,
    title: 'Practical Training',
    description: 'Learn through live demonstrations, laboratory sessions, and project-based learning designed to improve technical understanding.',
  },
  {
    icon: BookOpen,
    title: 'Industry-Relevant Curriculum',
    description: 'Programs are aligned with current industry requirements and emerging technology trends.',
  },
  {
    icon: GraduationCap,
    title: 'Expert Learning Environment',
    description: 'Students benefit from experienced trainers and structured learning methodologies that focus on practical application.',
  },
  {
    icon: Briefcase,
    title: 'Career-Oriented Skill Development',
    description: 'Our programs help learners develop the technical and professional skills required for careers in IT, software, networking, telecom, cloud computing, and cybersecurity.',
  },
  {
    icon: Sparkles,
    title: 'Technology Exposure',
    description: 'Students gain exposure to current tools, platforms, and technologies used across the IT and telecom industries.',
  },
];

const courseCategories = [
  {
    icon: Brain,
    title: 'Artificial Intelligence & Data Technologies',
    items: ['Artificial Intelligence (AI)', 'Machine Learning (ML)', 'Deep Learning', 'Data Science', 'Data Analytics'],
  },
  {
    icon: Code2,
    title: 'Programming & Software Development',
    items: ['Python Programming', 'Java Programming', 'Android Application Development', 'Web Development', 'SQL & Database Management'],
  },
  {
    icon: Cloud,
    title: 'Cloud & Cyber Security',
    items: ['Cloud Computing', 'AWS Cloud', 'Cyber Security', 'Blockchain Technology'],
  },
  {
    icon: Network,
    title: 'Networking & Infrastructure',
    items: ['Computer Networking', 'CCNA', 'CCNP', 'Network Administration', 'IPv4 & IPv6', 'MPLS VPN', 'QoS Technologies'],
  },
  {
    icon: Radio,
    title: 'Telecom Technologies',
    items: ['4G & 5G Technologies', 'Optical Fiber Communication (OFC)', 'FTTH Technologies', 'Microwave Communication', 'Mobile Network Planning', 'RF Engineering', 'Telecom Infrastructure'],
  },
  {
    icon: Cpu,
    title: 'Internet of Things (IoT)',
    items: ['IoT Fundamentals', 'Industry 4.0', 'Smart Home Solutions', 'Smart City Applications', 'Raspberry Pi & Arduino Projects'],
  },
];

const whyChooseList = [
  'Association with BSNL RTTC Hyderabad for skill development initiatives',
  'Industry-oriented curriculum',
  'Practical and project-based learning',
  'Experienced trainers',
  'Modern learning environment',
  'Emerging technology programs',
  'Career guidance',
  'Placement assistance',
  'Continuous skill enhancement',
  'Professional learning experience',
];

const whoCanJoin = [
  'Engineering Students', 'Diploma Students', 'Degree Students', 'Fresh Graduates',
  'Working Professionals', 'Career Switchers', 'IT Aspirants', 'Job Seekers',
];

const aboutStats = [
  { value: '1973', label: 'Established' },
  { value: 'Hyderabad', label: 'RTTC Location' },
  { value: 'PSU', label: 'Govt. of India Enterprise' },
  { value: 'Multi-Domain', label: 'Telecom + IT Training' },
];

const Partners = () => {
  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden">
      <SEO
        title="BSNL RTTC Skill Development Partner | NXGen Tech Academy"
        description="NXGen Tech Academy collaborates with BSNL RTTC Skill Development Partner in Hyderabad, offering practical training in AI, Python, Cyber Security, Cloud Computing, Networking and Telecom technologies"
        type="website"
        path="/bsnl-skill-development-partner"
      />

      <PageHero
        title="BSNL Skill Development Partner"
        description="Empowering Future Professionals Through Industry-Oriented Skill Development"
      >
        <Button size="lg" className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-semibold" asChild>
          <Link to="/our-training-programs">Start Your Learning Journey Today</Link>
        </Button>
      </PageHero>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            <strong className="text-gray-900">NXGen Tech Academy</strong> is proud to be associated with{' '}
            <strong className="text-gray-900">BSNL Regional Telecom Training Centre (RTTC)</strong>, Skill Development
            Partner in Hyderabad. This collaboration aims to bridge the gap between academic learning and industry
            requirements by providing learners with practical, technology-focused training in emerging IT and
            telecommunication.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Through this association, students gain access to industry-oriented learning, practical training, and
            career-focused programs designed to build job-ready skills for today's digital economy.
          </p>
        </div>
      </section>

      {/* Our Association with BSNL RTTC Hyderabad */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#000080]/5 text-[#000080] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" /> Building Industry-Ready Skills Together
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Association with BSNL RTTC Hyderabad</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-2">
                  <img src="/bsnl-logo.png" alt="BSNL Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-[#000080] rounded-full font-bold text-[10px] uppercase tracking-wide">
                    Skill Development Partner
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">BSNL RTTC Hyderabad</h3>
                </div>
              </div>

              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  NXGen Tech Academy works in association with BSNL RTTC Hyderabad to support skill development
                  initiatives that prepare students and professionals for careers in Information Technology and
                  Telecommunications.
                </p>
                <p>
                  BSNL RTTC Hyderabad is one of India's established telecom and technology training centres,
                  delivering technical education since 1973. It provides specialised training across telecom,
                  networking, software development, cloud computing, cybersecurity, artificial intelligence, and
                  other emerging technologies. The centre also supports government and industry skill development
                  training through practical, laboratory-based learning.
                </p>
                <p>
                  Our collaboration focuses on helping learners build practical knowledge through structured
                  training programs, hands-on sessions, and exposure to technologies used across modern industries.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <p className="text-2xl font-bold text-[#000080] mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#000080]/5 text-[#000080] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Industry-Focused Learning for Future Careers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Offer</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whatWeOffer.map((item, idx) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative p-6 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br from-[#000080]/5 to-[#22c55e]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <span className="absolute top-4 right-5 text-3xl font-black text-gray-100 select-none">0{idx + 1}</span>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#000080] to-[#00004d] flex items-center justify-center shadow-lg shadow-[#000080]/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses Offered */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#000080]/5 text-[#000080] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Explore High-Demand Technology Programs
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Courses Offered</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courseCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#000080]/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#000080]/10 flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-[#000080]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-gray-500 text-sm italic mt-10">
            These technology domains reflect the training areas described in the RTTC Hyderabad documentation.
          </p>
        </div>
      </section>

      {/* Why Choose NXGen Tech Academy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#000080]/5 text-[#000080] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Briefcase className="w-3.5 h-3.5" /> Your Partner in Career Growth
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose NXGen Tech Academy?</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4"
          >
            {whyChooseList.map((item) => (
              <motion.div
                key={item}
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-[#22c55e] hover:shadow-md transition-all"
              >
                <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p className="font-medium text-gray-800">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">Who Can Join?</h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3"
          >
            {whoCanJoin.map((role) => (
              <motion.span
                key={role}
                variants={fadeInUp}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-5 py-2.5 font-semibold text-gray-700 hover:border-[#000080] hover:text-[#000080] hover:shadow-md transition-all"
              >
                <Users className="w-4 h-4" /> {role}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000080] via-[#000080] to-[#00004d]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#22c55e]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Build Your Future?</h3>
            <p className="text-gray-600 mb-6">Contact our team today to learn more about our programs and upcoming batches.</p>
            <Button size="lg" className="bg-[#000080] hover:bg-[#000080]/90 text-white" asChild>
              <Link to="/contact-us">
                Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
