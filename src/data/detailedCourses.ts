import { BookOpen, CheckCircle, Clock, Award, BarChart, Code, Database, Globe, Brain, PieChart, Layers, Terminal, Search } from "lucide-react";

export interface DetailedCourse {
    id: string;
    title: string;
    tagline: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    lessons: number;
    projects: number;
    overview: string;
    outcomes: string[];
    curriculum: {
        module: string;
        topics: string[];
    }[];
    tools: {
        name: string;
        icon: any;
    }[];
    project: {
        title: string;
        description: string;
    };
    audience: string[];
    image: string;
    metaTitle?: string;
    metaDescription?: string;
    whyCourse?: string;
    whyChooseNxGen?: string[];
    careerOpportunities?: string[];
    feesAndDuration?: string;
    faqs?: { question: string; answer: string }[];
}

export const detailedCourses: Record<string, DetailedCourse> = {
    // AIML Courses
    "aiml-course-training": {
        id: "aiml-course-training",
        title: "AIML Programing",
        tagline: "AI and Machine Learning Training in Hyderabad – Learn AIML Skills for Future-Ready Careers.",
        level: "Beginner",
        duration: "3 to 4 Months",
        lessons: 45,
        projects: 7,
        image: "/AIML/AIML.png",
        metaTitle: "AI and Machine Learning Training in Hyderabad | AIML Course",
        metaDescription: "Learn AI and Machine Learning training in Hyderabad with hands-on projects, expert trainers, and predictive modeling skills for automation and AI careers.",
        overview: "AI and Machine Learning training in Hyderabad – Learn AIML Skills:\nAI and Machine Learning training in Hyderabad helps learners understand how systems learn from data and make accurate predictions. This AI and Machine Learning training in Hyderabad covers algorithms, models, and predictive analysis.\n\nToday, AIML powers automation tools, recommendation systems, and intelligent assistants. Therefore, AI and Machine Learning training in Hyderabad builds strong technical expertise. Moreover, AI and Machine Learning training in Hyderabad focuses on pattern recognition and predictive modelling.\n\nWhat is AI and Machine Learning Training in Hyderabad?\nAI and Machine Learning training in Hyderabad is a structured learning program that explains intelligent systems and automation. It introduces core concepts such as algorithms, models, and data-driven decision-making.\n\nAIML Concepts and Applications:\nAI and Machine Learning training in Hyderabad covers supervised and unsupervised learning methods. It also explains real-world applications in healthcare, finance, and automation. Furthermore, learners understand how predictive systems solve complex problems.",
        whyCourse: "Why Choose AI and Machine Learning Training in Hyderabad?\nAI and Machine Learning training in Hyderabad prepares learners for future-ready careers in technology. Many industries rely on AIML solutions for automation and decision-making.\n\nBenefits of Learning AIML Skills:\nAI and Machine Learning training in Hyderabad improves logical thinking and analytical abilities. It also builds confidence in developing intelligent systems. As a result, learners become capable of solving real-world challenges.",
        whyChooseNxGen: [
            "Industry-relevant AI and Machine Learning course curriculum",
            "Experienced trainers with practical expertise",
            "Hands-on training with real-time projects",
            "Step-by-step structured learning approach",
            "Continuous guidance and mentorship",
            "Industry-recognised certification"
        ],
        outcomes: [
            "Strengthens data analysis and interpretation skills",
            "Improves predictive modelling knowledge",
            "Provides real-time project experience",
            "Builds strong AIML fundamentals",
            "Enhances decision-making abilities",
            "Encourages innovation and creativity",
            "Develops programming and analytical skills",
            "Prepares for advanced technical roles"
        ],
        careerOpportunities: [
            "Machine Learning Engineer",
            "Data Scientist",
            "AI Engineer",
            "NLP Engineer",
            "Data Analyst",
            "AI Developer",
            "Automation Specialist"
        ],
        feesAndDuration: "Duration: 3-4 Months\nMode: Online / Offline / Hybrid\nCertification: Included",
        curriculum: [
            {
                module: "Introduction to AIML",
                topics: [
                    "AI and ML concepts",
                    "Industry applications",
                    "Real-world use cases",
                    "Basics overview"
                ]
            },
            {
                module: "Data Fundamentals",
                topics: [
                    "Types of data",
                    "Data collection methods",
                    "Data cleaning techniques",
                    "Data preprocessing basics"
                ]
            },
            {
                module: "Machine Learning Concepts",
                topics: [
                    "Supervised learning",
                    "Unsupervised learning",
                    "Model training methods",
                    "Model evaluation techniques"
                ]
            },
            {
                module: "Python for AIML",
                topics: [
                    "Python basics",
                    "Data structures",
                    "Introduction to libraries",
                    "Simple programs"
                ]
            },
            {
                module: "AI Applications",
                topics: [
                    "Natural Language Processing basics",
                    "Chatbot development",
                    "Image recognition",
                    "Voice processing"
                ]
            },
            {
                module: "Projects and Implementation",
                topics: [
                    "Mini projects",
                    "Prediction models",
                    "Case studies",
                    "Assignments"
                ]
            },
            {
                module: "Final Project and Certification",
                topics: [
                    "Project development",
                    "Model deployment basics",
                    "Final presentation",
                    "Certification"
                ]
            }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "Scikit-Learn", icon: BarChart },
            { name: "Pandas", icon: Database },
            { name: "TensorFlow", icon: Brain },
            { name: "Keras", icon: Layers }
        ],
        project: {
            title: "Predictive Analytics Capstone",
            description: "Build, train, and deploy an end-to-end Machine Learning model for a real-world use case like disease prediction or market analysis."
        },
        audience: ["Students", "Graduates", "Engineers", "Data Analysts"],
        faqs: [
            { question: "What is AI and Machine Learning training in Hyderabad?", answer: "AI and Machine Learning training in Hyderabad teaches how systems learn from data and make accurate predictions." },
            { question: "Is programming required for AIML training?", answer: "Basic programming is included in AI and Machine Learning training in Hyderabad." },
            { question: "What tools are used in AIML training?", answer: "AI and Machine Learning training in Hyderabad uses Python and machine learning libraries." },
            { question: "What are the applications of AIML?", answer: "Applications include healthcare, finance, automation, and recommendation systems." },
            { question: "Will I build models during training?", answer: "Yes, AI and Machine Learning training in Hyderabad includes model building and practical exercises." },
            { question: "Is certification provided after completion?", answer: "Yes, certification is provided after completing AI and Machine Learning training in Hyderabad." }
        ]
    },

    // AI Courses
    "ai-course-training": {
        id: "ai-course-training",
        title: "AI Programing",
        tagline: "Learn AI Skills for Future Careers with Industry-Ready Training in Hyderabad.",
        level: "Beginner",
        duration: "3 to 4 Months",
        lessons: 40,
        projects: 6,
        image: "/AI/AI.png",
        metaTitle: "Artificial Intelligence Training in Hyderabad | AI Course",
        metaDescription: "Learn Artificial intelligence training in Hyderabad with hands-on projects, expert trainers, and industry-ready skills for AI careers and future growth",
        overview: "Artificial intelligence training in Hyderabad helps learners understand how machines think, learn, and act intelligently. This artificial intelligence training in Hyderabad covers core concepts such as data, algorithms, and smart decision systems.\n\nToday, AI powers voice assistants, automation tools, and recommendation engines. Therefore, artificial intelligence training in Hyderabad builds strong technical foundations for modern careers.\n\nMoreover, artificial intelligence training in Hyderabad focuses on solving real-world problems using intelligent systems. It explains how machines analyse patterns and improve performance over time. As a result, learners gain hands-on experience through practical projects and guided learning.\n\nWhat is Artificial Intelligence Training in Hyderabad?\nArtificial intelligence training in Hyderabad is a structured learning program designed to teach AI concepts, tools, and applications. It introduces machine learning, data processing, and automation techniques in a simple way.",
        whyCourse: "Artificial intelligence training in Hyderabad explains how machines process data and make decisions. It also covers predictive analysis and pattern recognition. Furthermore, learners explore real-time applications in industries such as healthcare and finance.\n\nIn addition, artificial intelligence training in Hyderabad helps learners understand how systems improve accuracy using continuous learning. Consequently, students develop strong analytical and logical thinking abilities.",
        whyChooseNxGen: [
            "Industry-aligned curriculum",
            "Experienced trainers with real-world expertise",
            "Interactive and engaging sessions",
            "Hands-on projects and assignments",
            "Step-by-step guidance from basics to advanced",
            "Certification based on current standards"
        ],
        outcomes: [
            "Improves analytical thinking and logical reasoning",
            "Builds strong understanding of AI technologies",
            "Provides practical, project-based learning experience",
            "Enhances decision-making and prediction skills",
            "Develops real-world problem-solving abilities",
            "Supports career growth in emerging technologies",
            "Encourages innovation and creative thinking",
            "Strengthens technical foundations for future roles"
        ],
        careerOpportunities: [
            "AI Engineer",
            "Data Analyst",
            "Robotics Engineer",
            "AI Research Associate",
            "Automation Specialist",
            "AI Product Developer"
        ],
        feesAndDuration: "Duration: 3-4 Months\nMode: Online / Offline / Hybrid\nPlacement Support: Included",
        curriculum: [
            {
                module: "Month 1: Introduction to AI & Logic Building",
                topics: [
                    "Definition and meaning of artificial intelligence",
                    "Types of artificial intelligence systems",
                    "Common AI applications in industries",
                    "History and evolution of AI",
                    "Logical reasoning techniques",
                    "Pattern recognition skills"
                ]
            },
            {
                module: "Month 2: Machine Learning Fundamentals",
                topics: [
                    "Introduction to machine learning",
                    "Types of learning models",
                    "Training data concepts",
                    "Model evaluation basics",
                    "Predictive analysis basics"
                ]
            },
            {
                module: "Month 3: Data Handling & AI Tools",
                topics: [
                    "Types of data used in AI",
                    "Data collection & cleaning methods",
                    "Pattern identification techniques",
                    "Overview of AI tools and platforms",
                    "Introduction to Chatbot development"
                ]
            },
            {
                module: "Month 4: Practical Implementation & Projects",
                topics: [
                    "Image recognition concepts",
                    "Voice processing applications",
                    "Mini AI-based projects",
                    "Real-world application tasks",
                    "Final Project development",
                    "Certification assessment"
                ]
            }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "TensorFlow", icon: Brain },
            { name: "Scikit-Learn", icon: BarChart },
            { name: "OpenCV", icon: Layers },
            { name: "Dialogflow", icon: Globe }
        ],
        project: {
            title: "Real-time AI Application Project",
            description: "Develop a complete AI-based project such as a chatbot, image classifier, or predictive model using the skills learned."
        },
        audience: ["Students", "Graduates", "Working Professionals", "Beginners"],
        faqs: [
            { question: "What is artificial intelligence training in Hyderabad?", answer: "Artificial intelligence training in Hyderabad teaches how machines learn, analyse data, and make intelligent decisions using algorithms." },
            { question: "Who can join artificial intelligence training in Hyderabad?", answer: "Students, graduates, and working professionals can join artificial intelligence training in Hyderabad without prior advanced experience." },
            { question: "What skills are required for AI training?", answer: "Basic programming knowledge and logical thinking help learners succeed in artificial intelligence training in Hyderabad." },
            { question: "What are the benefits of artificial intelligence training in Hyderabad?", answer: "It improves analytical skills, builds technical expertise, and opens career opportunities in emerging technologies." },
            { question: "What job roles are available after AI training?", answer: "Learners can become AI engineers, data analysts, automation specialists, or AI developers after completing artificial intelligence training in Hyderabad." }
        ]
    },
    "digital-marketing-job-guarantee-course-training": {
        id: "digital-marketing-job-guarantee-course-training",
        title: "Job Guarantee Digital Marketing Course",
        tagline: "6 Months Advanced Training in Hyderabad with AI-Powered Tools and Structured Mentorship.",
        level: "Advanced",
        duration: "6 Months",
        lessons: 90,
        projects: 8,
        image: "/dm-job-guarantee.jpg",
        metaTitle: "Job Guarantee Digital Marketing Course in Hyderabad | 6 Months Advanced Training",
        metaDescription: "Enroll in the best job guarantee digital marketing course in Hyderabad. 6 months advanced training with AI tools, live projects, and 100% placement assistance.",
        overview: "Job guarantee digital marketing course in Hyderabad helps you gain advanced skills and secure a career in the fast-growing digital industry. This 6-month program focuses on practical learning, real-time projects, and industry-ready training.\n\nMoreover, the course combines AI-powered tools, live campaigns, and structured mentorship. As a result, learners build confidence and become job-ready professionals.\n\nCourse Overview – 6 Months Job-Focused Digital Marketing Training\nThis job guarantee digital marketing course is designed for serious learners who want career outcomes. It provides deep knowledge of digital marketing concepts along with hands-on experience.\n\nIn addition, the program follows a step-by-step approach. Therefore, students can move from beginner level to advanced expertise.",
        whyCourse: "Job guarantee digital marketing training focuses on building skills that match industry requirements. It prepares learners for real job roles through practical exposure.\n\nWhy Choose a Job Guarantee Digital Marketing Course in Hyderabad?\n1. High demand for digital marketing professionals\n2. Practical learning with real-time campaigns\n3. Structured placement assistance\n4. Industry-focused curriculum\n\nAdvanced Learning with AI in Digital Marketing\nAI plays a major role in modern marketing strategies. This course includes AI-based tools and automation techniques.",
        whyChooseNxGen: [
            "6 months intensive training",
            "Online and offline learning options",
            "Internship with live projects",
            "Placement-focused guidance",
            "Continuous assessments",
            "AI tools for content and ads"
        ],
        outcomes: [
            "Industry-ready skills in SEO, PPC, and SMM",
            "Hands-on project experience with live campaigns",
            "Strong portfolio development",
            "Better job opportunities with high salary",
            "Career guidance and interview support"
        ],
        careerOpportunities: [
            "Digital Marketing Executive",
            "SEO Analyst",
            "PPC Specialist",
            "Social Media Manager",
            "Lead Generation Specialist",
            "Content Marketing Strategist"
        ],
        feesAndDuration: "Total Duration: 6 Months\nMode: Online / Offline / Hybrid\nTraining Type: Job-focused program\nInternship: Included",
        curriculum: [
            {
                module: "Month 1: Digital Marketing & SEO Foundations",
                topics: [
                    "Introduction to digital marketing ecosystem",
                    "Website basics and domain setup",
                    "Keyword research techniques",
                    "On-page SEO optimization",
                    "SEO tools introduction"
                ]
            },
            {
                module: "Month 2: Advanced SEO & Content Strategy",
                topics: [
                    "Off-page SEO techniques",
                    "Link building strategies",
                    "Technical SEO basics",
                    "Content planning and blogging",
                    "Competitor analysis"
                ]
            },
            {
                module: "Month 3: Google Ads & Paid Marketing",
                topics: [
                    "Google Ads account setup",
                    "Search and display campaigns",
                    "Keyword targeting strategies",
                    "Ad copywriting",
                    "Conversion tracking"
                ]
            },
            {
                module: "Month 4: Social Media & Meta Ads",
                topics: [
                    "Social media platform strategies",
                    "Facebook and Instagram ads",
                    "Audience targeting techniques",
                    "Campaign optimization",
                    "Performance analysis"
                ]
            },
            {
                module: "Month 5: Automation, Email & AI Marketing",
                topics: [
                    "Email marketing campaigns",
                    "WhatsApp marketing setup",
                    "Marketing automation tools",
                    "AI tools for digital marketing",
                    "Lead nurturing strategies"
                ]
            },
            {
                module: "Month 6: Analytics, Projects & Placement Prep",
                topics: [
                    "Google Analytics basics",
                    "Funnel creation and tracking",
                    "Live campaign execution",
                    "Resume building",
                    "Mock interviews",
                    "Placement assistance"
                ]
            }
        ],
        tools: [
            { name: "Google Ads", icon: BarChart },
            { name: "Meta Business Suite", icon: Layers },
            { name: "SEMrush", icon: Search },
            { name: "Ahrefs", icon: Database },
            { name: "Chat GPT / AI Tools", icon: Brain }
        ],
        project: {
            title: "Live End-to-End Campaign Execution",
            description: "Manage real budgets for SEO, Social Media, and Google Ads, tracking ROI and performance metrics for a 6-month period."
        },
        audience: ["Students and graduates", "Career switchers", "Marketing professionals"],
        faqs: [
            { question: "Is this a job guarantee digital marketing course?", answer: "The course provides strong placement assistance and career support." },
            { question: "Who can join this program?", answer: "Students, graduates, and professionals can enroll." },
            { question: "Are live projects included?", answer: "Yes, real-time projects are part of the training." },
            { question: "What tools will I learn?", answer: "You will learn SEO tools, Google Ads, analytics, and AI tools." },
            { question: "Is prior experience required?", answer: "No, beginners can start easily." }
        ]
    },
    "digital-marketing-course-training": {
        id: "digital-marketing-course-training",
        title: "Digital Marketing Course",
        tagline: "Master Essential Digital Marketing Skills in Just 3 Months.",
        level: "Beginner",
        duration: "3 Months",
        lessons: 45,
        projects: 4,
        image: "/dm-regular.jpg",
        metaTitle: "Digital Marketing Course in Hyderabad | 3 Months Fast-Track Training",
        metaDescription: "Learn digital marketing in Hyderabad with our 3-month fast-track course. Master SEO, Google Ads, and social media marketing with practical training.",
        overview: "Digital marketing course in Hyderabad offers a fast-track learning path to build practical marketing skills in just 3 months. This training program focuses on real-time implementation, industry tools, and job-oriented learning.\n\nMoreover, the course is available in both online and offline formats. As a result, learners can choose a flexible or classroom-based experience.\n\nCourse Overview – 3 Months Digital Marketing Training\nThis digital marketing course in Hyderabad is designed for beginners and professionals who want quick skill development. It covers all essential modules required to start a career in digital marketing.",
        whyCourse: "3 months digital marketing course in Hyderabad is ideal for those who want quick career entry.\n\nKey Reasons\n1. Short duration with complete fundamentals\n2. High demand for digital marketing skills\n3. Practical learning approach\n4. Suitable for beginners\n\nTherefore, this course helps you start your career faster.",
        whyChooseNxGen: [
            "Quick skill development",
            "Practical knowledge",
            "Industry-relevant tools",
            "Live interactive sessions",
            "Flexible schedules",
            "Expert trainer interaction"
        ],
        outcomes: [
            "Foundational skills in Digital Marketing",
            "Practical understanding of marketing tools",
            "Ability to start freelancing",
            "Initial job entry opportunities",
            "Hands-on project experience"
        ],
        careerOpportunities: [
            "Digital Marketing Executive",
            "SEO Executive",
            "Social Media Executive",
            "PPC Assistant",
            "Content Creator",
            "Freelance Marketer"
        ],
        feesAndDuration: "Duration: 3 Months\nMode: Online / Offline\nLevel: Beginner to Intermediate",
        curriculum: [
            {
                module: "Month 1: Digital Marketing Basics & SEO",
                topics: [
                    "Introduction to digital marketing",
                    "Website basics",
                    "Keyword research",
                    "On-page SEO",
                    "SEO tools overview"
                ]
            },
            {
                module: "Month 2: Paid Ads & Social Media Marketing",
                topics: [
                    "Google Ads fundamentals",
                    "Campaign setup",
                    "Social media strategy",
                    "Facebook and Instagram ads",
                    "Content planning"
                ]
            },
            {
                module: "Month 3: Advanced Topics & Projects",
                topics: [
                    "Email marketing basics",
                    "WhatsApp marketing",
                    "Lead generation",
                    "Analytics basics",
                    "Live project execution"
                ]
            }
        ],
        tools: [
            { name: "Google Search Console", icon: Search },
            { name: "Google Analytics 4", icon: BarChart },
            { name: "Canva", icon: PieChart },
            { name: "Meta Ads Manager", icon: Layers }
        ],
        project: {
            title: "3-Month Digital Marketing Project",
            description: "Execute basic SEO and Social Media campaigns for a sample project within the 3-month timeline."
        },
        audience: ["Beginners", "Business owners", "Students"],
        faqs: [
            { question: "Is 3 months enough to learn digital marketing?", answer: "Yes, this course covers essential skills for entry-level roles." },
            { question: "Can beginners join this course?", answer: "Yes, no prior experience is required." },
            { question: "Which tools will I learn?", answer: "You will learn SEO tools, Google Ads, and analytics basics." },
            { question: "Is online training effective?", answer: "Yes, online sessions include live interaction and practical learning." },
            { question: "Will I get practical experience?", answer: "Yes, live projects and assignments are included." }
        ]
    },
    "python-course-training": {
        id: "python-course-training",
        title: "Python Programming",
        tagline: "Learn Python programming with practical projects at NxGen Tech Academy in Hyderabad.",
        level: "Beginner",
        duration: "3 to 4 Months",
        lessons: 40,
        projects: 3,
        image: "/sap/python.png",
        metaTitle: "Python Course Training in Hyderabad | NxGen Tech Academy",
        metaDescription: "Learn Python programming with practical projects at NxGen Tech Academy in Hyderabad. Industry trainers, real-time projects, and career support. Enroll today.",
        overview: "Python Course training is one of the most popular choices for students who want a career in software development. Python is simple to learn and powerful in real applications. Many companies use Python for building websites, automation tools, data analysis, and artificial intelligence systems.\n\nAt NxGen Tech Academy, the Python course focuses on practical learning and industry skills. Students learn programming fundamentals and develop real applications. The training helps beginners understand coding easily. At the same time, it prepares learners for professional development environments.\n\nPython continues to grow in demand across IT companies. Therefore, learning Python programming can open many career opportunities.\n\nWhat is Python Programming?\nPython is a high-level programming language created by Guido van Rossum in 1991. It is known for its clear syntax and readable structure. Developers can write programs with fewer lines of code.\n\nPython supports multiple programming approaches. Therefore, developers can build different types of applications easily.\n\nMajor Programming Styles Supported in Python:\n• Object Oriented Programming (OOP)\n• Procedural Programming\n• Functional Programming\n\nPython includes thousands of open-source libraries. These libraries help developers build applications faster.\n\nToday Python is used in many industries. For example, it powers web platforms, AI systems, automation scripts, and data analytics tools.",
        whyCourse: "Python has become one of the most demanded programming languages in the IT industry. Many organisations choose Python because development becomes faster and easier.\n\nPython also allows beginners to learn programming without difficulty. The syntax looks close to normal English statements.\n\nMany global companies use Python in their technology stack.\n\nExamples include:\nGoogle\nNetflix\nInstagram\nSpotify\nDropbox\n\nAs a result, Python developers are highly valued in the job market.",
        outcomes: [
            "Easy to Learn – Python syntax is simple and beginner friendly.",
            "High Industry Demand – Python developers are required in many companies.",
            "Multiple Career Paths – Python works in AI, web development, automation, and data science.",
            "Large Developer Community – Millions of developers support Python worldwide.",
            "Faster Development – Python allows quick development of applications.",
            "Powerful Libraries – Libraries simplify complex tasks in development."
        ],
        whyChooseNxGen: [
            "Industry experienced trainers",
            "Practical coding sessions",
            "Real-time project development",
            "Interview preparation sessions",
            "Updated industry-level syllabus",
            "Personal mentorship and guidance"
        ],
        careerOpportunities: [
            "Python Developer",
            "Backend Developer",
            "Data Analyst",
            "Data Scientist",
            "Machine Learning Engineer",
            "Automation Engineer",
            "Web Application Developer"
        ],
        feesAndDuration: "Course Duration: 3 to 4 Months\nTraining Mode: Classroom Training / Online Training\nCourse Fee: Contact NxGen Tech Academy for updated fee details",
        curriculum: [
            { module: "What is Python Programming?", topics: ["Introduction to Python", "Features of Python", "Major Programming Styles Supported (OOP, Procedural, Functional)"] },
            { module: "Python Fundamentals", topics: ["Variables & Data Types", "Control Statements", "Strings & Collections", "Functions"] },
            { module: "Advanced Python & OOP", topics: ["Object-Oriented Programming (OOP) Concepts", "Exception Handling", "File Handling", "Open-source libraries"] },
            { module: "Real-time Project Development", topics: ["Practical coding sessions", "Real-time projects", "Interview preparation sessions"] }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "VS Code", icon: Terminal },
            { name: "MySQL", icon: Database },
            { name: "Django / Flask", icon: Globe }
        ],
        project: {
            title: "Real-time Industry Projects",
            description: "Practical coding assignments, mini projects, and final project development."
        },
        audience: ["Students", "Graduates", "Working Professionals", "Beginners"],
        faqs: [
            { question: "Who can join the Python course?", answer: "Anyone interested in programming can join the Python course. Students, graduates, and working professionals can learn Python easily." },
            { question: "Is Python difficult to learn for beginners?", answer: "No. Python is considered one of the easiest programming languages. Its syntax is simple and readable." },
            { question: "What are the prerequisites for learning Python?", answer: "Basic computer knowledge is enough to start learning Python programming." },
            { question: "What jobs can I get after Python training?", answer: "Students can apply for roles such as Python developer, data analyst, automation engineer, and backend developer." },
            { question: "Does the Python course include practical projects?", answer: "Yes. The training includes assignments, coding practice, and real-time projects." }
        ]
    },
    "data-analytics-course-training": {
        id: "data-analytics-course-training",
        title: "Data Analytics programing",
        tagline: "Master In-Demand Skills and Build a High-Growth Career with NxGen Tech Academy.",
        level: "Beginner",
        duration: "3 to 4 Months",
        lessons: 45,
        projects: 4,
        image: "/data-analytics.jpg",
        metaTitle: "Data Analytics Online Training | Learn Data Analytics Course Online",
        metaDescription: "Join data analytics online training and learn Excel, SQL, Python, Power BI, and Tableau. Build job-ready skills with expert guidance.",
        overview: "Data analytics online training helps you gain in-demand skills and build a successful career in today’s data-driven world. This training program focuses on practical learning, real-time projects, and industry-relevant tools.\n\nMoreover, learners can access flexible classes, expert guidance, and job-oriented training from anywhere. As a result, this course suits students, graduates, and working professionals.\n\nWhat is Data Analytics Online Training?\nData analytics online training is a structured program that teaches how to analyse data and extract useful insights. It includes tools, techniques, and real-world case studies.\n\nIn addition, learners understand how businesses use data to make decisions. This approach helps build strong analytical thinking.",
        whyCourse: "Data analytics online training offers flexibility and career growth opportunities. Therefore, it has become one of the most preferred courses.\n\nKey Reasons\n• Learn from industry experts\n• Access live and recorded sessions\n• Work on real-world projects\n• Get career support and guidance\n\nFurthermore, online training reduces travel time and increases learning efficiency.\n\nTypes of Data Analytics Covered in Training:\n1. Descriptive Analytics\nDescriptive analytics explains past data trends. It helps understand what has already happened.\n2. Diagnostic Analytics\nDiagnostic analytics identifies reasons behind data patterns. It helps in root cause analysis.\n3. Predictive Analytics\nPredictive analytics forecasts future outcomes using statistical models. It supports better planning.\n4. Prescriptive Analytics\nPrescriptive analytics suggests the best actions. It improves decision-making accuracy.",
        whyChooseNxGen: [
            "Live instructor-led sessions",
            "Real-time projects",
            "Certification support",
            "Placement assistance",
            "Personalized mentorship"
        ],
        outcomes: [
            "Understand data collection and cleaning",
            "Learn data visualisation techniques",
            "Work with real-time datasets",
            "Build analytical dashboards"
        ],
        careerOpportunities: [
            "Data Analyst",
            "Business Analyst",
            "Data Consultant",
            "Reporting Analyst",
            "Data Visualization Expert",
            "Business Intelligence Developer"
        ],
        feesAndDuration: "Total Duration: 3–4 Months\nWeekly Commitment: 10–12 Hours\nMode: Online / Offline / Hybrid\nLevel: Beginner to Intermediate",
        curriculum: [
            {
                module: "Data Analytics Foundations (Week 1–2)",
                topics: [
                    "Introduction to Data Analytics",
                    "Types of Data Analytics",
                    "Data Analytics Lifecycle",
                    "Role of Data Analyst",
                    "Business Use Cases",
                    "Basics of Data Handling"
                ]
            },
            {
                module: "Excel for Data Analytics (Week 2–4)",
                topics: [
                    "Excel Basics & Shortcuts",
                    "Data Cleaning Techniques",
                    "Functions (IF, VLOOKUP, INDEX, MATCH)",
                    "Pivot Tables & Charts",
                    "Dashboard Creation",
                    "Real-time Excel Use Cases"
                ]
            },
            {
                module: "SQL for Data Analytics (Week 4–6)",
                topics: [
                    "Database Concepts",
                    "SQL Basics (SELECT, WHERE, ORDER BY)",
                    "Joins (INNER, LEFT, RIGHT)",
                    "Aggregate Functions",
                    "Subqueries & Views",
                    "Solving Business Queries"
                ]
            },
            {
                module: "Python for Data Analytics (Week 6–9)",
                topics: [
                    "Python Basics (Variables, Loops, Functions)",
                    "NumPy for Numerical Operations",
                    "Pandas for Data Analysis",
                    "Data Cleaning in Python",
                    "Data Visualisation (Matplotlib, Seaborn)",
                    "Working with CSV & Excel Data"
                ]
            },
            {
                module: "Statistics for Data Analytics (Week 8–10)",
                topics: [
                    "Descriptive Statistics",
                    "Probability Basics",
                    "Correlation & Regression",
                    "Hypothesis Testing",
                    "Data Distribution"
                ]
            },
            {
                module: "Data Visualisation (Power BI/Tableau) (Week 10–12)",
                topics: [
                    "Introduction to Power BI / Tableau",
                    "Data Loading & Transformation",
                    "Data Modelling Basics",
                    "Creating Dashboards",
                    "DAX Basics (Power BI)",
                    "Publishing Reports"
                ]
            },
            {
                module: "Data Cleaning & Transformation (Week 11–13)",
                topics: [
                    "Handling Missing Values",
                    "Removing Duplicates",
                    "Data Transformation Techniques",
                    "Feature Engineering Basics",
                    "Data Formatting"
                ]
            },
            {
                module: "Real-Time Project (Week 13–16)",
                topics: [
                    "End-to-End Project Development",
                    "Business Problem Understanding",
                    "Data Collection & Cleaning",
                    "Analysis & Insights",
                    "Dashboard Creation",
                    "Final Presentation"
                ]
            },
            {
                module: "Industry Readiness (Parallel Throughout)",
                topics: [
                    "Resume Preparation",
                    "SQL & Python Interview Questions",
                    "Case Study Discussions",
                    "Mock Interviews",
                    "Portfolio & GitHub Setup"
                ]
            }
        ],
        tools: [
            { name: "Microsoft Excel", icon: BarChart },
            { name: "SQL", icon: Database },
            { name: "Python", icon: Code },
            { name: "Power BI", icon: PieChart },
            { name: "Tableau", icon: Layers }
        ],
        project: {
            title: "End-to-End Industry Analytics Project",
            description: "Work on real-world datasets from various industries like E-commerce, Finance or Healthcare to build a complete analytical solution."
        },
        audience: ["Students and fresh graduates", "Working professionals", "Business owners", "Career switchers"],
        faqs: [
            { question: "What is data analytics online training?", answer: "Data analytics online training teaches how to analyse data and generate insights for decision-making." },
            { question: "Who can join this training?", answer: "Students, professionals, and beginners can join without prior experience." },
            { question: "What tools are covered in training?", answer: "The training includes Excel, SQL, Python, Power BI, and Tableau." },
            { question: "Is data analytics online training suitable for beginners?", answer: "Yes, beginners can easily learn with step-by-step guidance." },
            { question: "What career options are available after training?", answer: "You can become a data analyst, business analyst, or reporting analyst." }
        ]
    }
};
