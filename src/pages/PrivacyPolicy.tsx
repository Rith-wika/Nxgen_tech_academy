import React from 'react';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, RefreshCw, Mail, FileText, Cookie, ExternalLink, UserCheck } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      icon: <ShieldCheck className="w-6 h-6 text-[#000080]" />,
      content: "NxGen Tech Academy values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website nxgentechacademy.com."
    },
    {
      title: "Information We Collect",
      icon: <FileText className="w-6 h-6 text-[#000080]" />,
      content: "We may collect personal information such as your name, email address, phone number, and other details when you:",
      list: [
        "Register for courses",
        "Fill out inquiry forms",
        "Contact us through the website",
        "Subscribe to updates or newsletters"
      ],
      extra: "We may also collect non-personal information such as browser type, device information, and website usage data."
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="w-6 h-6 text-[#000080]" />,
      content: "The information we collect may be used to:",
      list: [
        "Provide information about our courses and services",
        "Respond to your inquiries",
        "Improve our website and services",
        "Send important updates related to courses or training programs",
        "Provide customer support"
      ]
    },
    {
      title: "Sharing of Information",
      icon: <RefreshCw className="w-6 h-6 text-[#000080]" />,
      content: "NxGen Tech Academy does not sell, rent, or trade your personal information to third parties. Information may only be shared when necessary to:",
      list: [
        "Provide requested services",
        "Comply with legal requirements",
        "Protect the security and integrity of our website"
      ]
    },
    {
      title: "Cookies and Tracking Technologies",
      icon: <Cookie className="w-6 h-6 text-[#000080]" />,
      content: "Our website may use cookies to enhance user experience and analyze website traffic."
    },
    {
      title: "Data Security",
      icon: <Lock className="w-6 h-6 text-[#000080]" />,
      content: "We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure."
    },
    {
      title: "Third Party Links",
      icon: <ExternalLink className="w-6 h-6 text-[#000080]" />,
      content: "Our website may contain links to external websites. NxGen Tech Academy is not responsible for the privacy practices of these third-party websites."
    },
    {
      title: "User Rights",
      icon: <UserCheck className="w-6 h-6 text-[#000080]" />,
      content: "Users may request access, correction, or deletion of their personal information where applicable."
    },
    {
      title: "Changes to This Privacy Policy",
      icon: <RefreshCw className="w-6 h-6 text-[#000080]" />,
      content: "NxGen Tech Academy may update this Privacy Policy periodically. Changes will be reflected on this page with an updated date."
    },
    {
      title: "Contact Information",
      icon: <Mail className="w-6 h-6 text-[#000080]" />,
      content: "If you have any questions regarding this Privacy Policy, please contact us through the contact information provided on the website."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SEO
        title="Privacy Policy | NxGen Tech Academy"
        description="Learn how NxGen Tech Academy collects, uses, and protects your personal information when you visit our website or enroll in our courses."
        path="/privacy-policy"
      />

      <PageHero
        title="Privacy Policy"
        description="Your privacy is important to us. Learn how we handle your data."
      />

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-100 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Overview</h2>
            <p className="text-sm text-gray-500 font-medium">Last Updated: March 12, 2026</p>
          </div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <div className="text-gray-600 leading-relaxed md:pl-12">
                  <p>{section.content}</p>
                  {section.list && (
                    <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.extra && <p className="mt-4">{section.extra}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
