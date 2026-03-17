import { BookOpen, CheckCircle, Clock, Award, BarChart, Code, Database, Globe, Brain, PieChart, Layers, Terminal } from "lucide-react";

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
    "da-intro": {
        id: "da-intro",
        title: "Introduction to Data Analytics (Foundation)",
        tagline: "Understand the analytics lifecycle and business context.",
        level: "Beginner",
        duration: "2 Weeks",
        lessons: 12,
        projects: 1,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
        overview: "This course introduces the fundamentals of data analytics and how data is used to solve real business problems. Learners will understand the complete analytics lifecycle and industry roles.",
        outcomes: [
            "Understand how data analytics supports business decisions",
            "Identify analytics roles and workflows",
            "Work with basic datasets confidently"
        ],
        curriculum: [
            { module: "Module 1: Foundations", topics: ["What is Data Analytics", "Analytics roles & workflow"] },
            { module: "Module 2: Data Lifecycle", topics: ["Collect → Clean → Explore → Interpret"] },
            { module: "Module 3: Data Types", topics: ["Structured vs Unstructured data"] },
            { module: "Module 4: Business Metrics", topics: ["KPIs, metrics & business questions"] },
            { module: "Module 5: Practical Skills", topics: ["Working with CSV & Excel files", "Introduction to data cleaning"] }
        ],
        tools: [
            { name: "Microsoft Excel", icon: BarChart }
        ],
        project: {
            title: "Explore a sales CSV dataset",
            description: "Explore a sales CSV dataset, identify KPIs and data quality issues."
        },
        audience: ["Students", "Fresh graduates", "Career switchers", "Business professionals"]
    },
    "da-excel": {
        id: "da-excel",
        title: "Excel & Fundamental Analytics",
        tagline: "Perform business analysis using spreadsheets and build professional dashboards.",
        level: "Beginner",
        duration: "3 Weeks",
        lessons: 15,
        projects: 1,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
        overview: "This course focuses on performing business analysis using spreadsheets and building professional dashboards.",
        outcomes: [
            "Clean and analyze data using Excel",
            "Create reports and dashboards",
            "Perform descriptive analysis"
        ],
        curriculum: [
            { module: "Module 1: Data Preparation", topics: ["Data cleaning, sorting & filtering"] },
            { module: "Module 2: Formulas", topics: ["IF, VLOOKUP/XLOOKUP, INDEX-MATCH"] },
            { module: "Module 3: Pivot Tables", topics: ["Pivot Tables & Pivot Charts"] },
            { module: "Module 4: Analysis", topics: ["Descriptive statistics"] },
            { module: "Module 5: Visualization", topics: ["Dashboard design"] }
        ],
        tools: [
            { name: "Microsoft Excel", icon: BarChart }
        ],
        project: {
            title: "Sales Dashboard",
            description: "Create a complete sales dashboard in Excel."
        },
        audience: ["Beginners", "Business Analysts", "Operations Managers"]
    },
    "da-sql": {
        id: "da-sql",
        title: "SQL for Data Analytics",
        tagline: "Query, filter, and analyze data stored in databases using SQL.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 18,
        projects: 1,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200",
        overview: "Learn how to query, filter, and analyze data stored in databases using SQL.",
        outcomes: [
            "Write efficient SQL queries",
            "Extract insights from databases",
            "Build KPI reports from raw data"
        ],
        curriculum: [
            { module: "Module 1: Concepts", topics: ["Database concepts & relational models", "Tables, keys & relationships"] },
            { module: "Module 2: Basic Queries", topics: ["SELECT, WHERE, GROUP BY, ORDER BY"] },
            { module: "Module 3: Advanced Queries", topics: ["JOINS (INNER, LEFT, RIGHT)", "Subqueries & aggregations"] },
            { module: "Module 4: Optimization", topics: ["Query optimization basics"] }
        ],
        tools: [
            { name: "MySQL", icon: Database }
        ],
        project: {
            title: "KPI Reporting",
            description: "Write analytical SQL queries and build KPI reports using database tables."
        },
        audience: ["Data Analysts", "Developers", "Database Administrators"]
    },
    "da-python": {
        id: "da-python",
        title: "Python for Data Analytics",
        tagline: "Perform EDA and data manipulation programmatically.",
        level: "Intermediate",
        duration: "5 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200",
        overview: "This course introduces Python for data analysis, focusing on EDA and data manipulation.",
        outcomes: [
            "Perform data cleaning using Python",
            "Conduct Exploratory Data Analysis",
            "Visualize insights programmatically"
        ],
        curriculum: [
            { module: "Module 1: Python Basics", topics: ["Python basics for analytics", "NumPy arrays"] },
            { module: "Module 2: Pandas", topics: ["Pandas DataFrames", "Data cleaning & transformation", "Handling missing values"] },
            { module: "Module 3: EDA", topics: ["EDA techniques"] },
            { module: "Module 4: Visualization", topics: ["Basic visualization using Matplotlib"] }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "NumPy", icon: Code },
            { name: "Pandas", icon: Code },
            { name: "Matplotlib", icon: BarChart }
        ],
        project: {
            title: "End-to-End EDA",
            description: "Complete an end-to-end Exploratory Data Analysis project using Python."
        },
        audience: ["Data Scientists", "Analysts", "Programmers"]
    },
    "da-r": {
        id: "da-r",
        title: "R Programming for Analytics",
        tagline: "Statistical analysis and visualization using R.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 16,
        projects: 1,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
        overview: "An optional track for learners interested in statistical analysis and visualization using R.",
        outcomes: [
            "Perform data analysis using R",
            "Create professional statistical visualizations"
        ],
        curriculum: [
            { module: "Module 1: Fundamentals", topics: ["R syntax & data structures"] },
            { module: "Module 2: Wrangling", topics: ["Data wrangling"] },
            { module: "Module 3: Statistics", topics: ["Statistical summaries"] },
            { module: "Module 4: Visualization", topics: ["Visual storytelling using ggplot2"] }
        ],
        tools: [
            { name: "R", icon: Code },
            { name: "ggplot2", icon: BarChart }
        ],
        project: {
            title: "Visual Storytelling",
            description: "Dataset visualization using ggplot2."
        },
        audience: ["Statisticians", "Researchers", "Data Analysts"]
    },
    "da-viz": {
        id: "da-viz",
        title: "Data Visualization & BI Tools",
        tagline: "Build interactive dashboards and communicate insights effectively.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 15,
        projects: 2,
        image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200",
        overview: "Learn to build interactive dashboards and communicate insights effectively to stakeholders.",
        outcomes: [
            "Design business dashboards",
            "Apply data modeling concepts",
            "Present insights visually"
        ],
        curriculum: [
            { module: "Module 1: Modeling", topics: ["Data modeling basics"] },
            { module: "Module 2: Reporting", topics: ["Visual creation & reporting", "DAX fundamentals"] },
            { module: "Module 3: Design", topics: ["Dashboard design principles"] },
            { module: "Module 4: Sharing", topics: ["Publishing & sharing dashboards"] }
        ],
        tools: [
            { name: "Power BI", icon: BarChart },
            { name: "Tableau", icon: BarChart }
        ],
        project: {
            title: "Interactive Dashboards",
            description: "Build interactive dashboards in Power BI and perform data storytelling using Tableau."
        },
        audience: ["BI Developers", "Data Analysts", "Consultants"]
    },
    "da-stats": {
        id: "da-stats",
        title: "Statistics & Probability for Analytics",
        tagline: "Validate insights and support decision-making with statistics.",
        level: "Intermediate",
        duration: "3 Weeks",
        lessons: 12,
        projects: 1,
        image: "https://images.unsplash.com/photo-1599658880436-c61792e70672?w=1200",
        overview: "Build a strong foundation in statistics to validate insights and support decision-making.",
        outcomes: [
            "Apply statistical methods to data",
            "Interpret analytical results confidently"
        ],
        curriculum: [
            { module: "Module 1: Descriptives", topics: ["Mean, median, variance & standard deviation"] },
            { module: "Module 2: Probability", topics: ["Probability distributions"] },
            { module: "Module 3: Inference", topics: ["Hypothesis testing", "Confidence intervals"] },
            { module: "Module 4: Modeling", topics: ["Correlation vs Regression"] }
        ],
        tools: [
            { name: "Excel/Python", icon: BarChart }
        ],
        project: {
            title: "Statistical Analysis",
            description: "Perform statistical analysis on real datasets to validate hypotheses."
        },
        audience: ["Data Analysts", "Researchers", "Students"]
    },
    "da-predictive": {
        id: "da-predictive",
        title: "Predictive Analytics & ML Basics",
        tagline: "Note: Basic machine learning and predictive modeling.",
        level: "Advanced",
        duration: "4 Weeks",
        lessons: 16,
        projects: 1,
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200",
        overview: "Learn the basics of machine learning and predictive modeling for business use cases.",
        outcomes: [
            "Build basic predictive models",
            "Understand model evaluation concepts"
        ],
        curriculum: [
            { module: "Module 1: Regression", topics: ["Linear regression"] },
            { module: "Module 2: Classification", topics: ["Classification fundamentals"] },
            { module: "Module 3: Clustering", topics: ["Clustering (K-Means)"] },
            { module: "Module 4: Evaluation", topics: ["Model evaluation metrics", "Business forecasting"] }
        ],
        tools: [
            { name: "Python", icon: Code }
        ],
        project: {
            title: "Prediction Model",
            description: "Build a prediction model using Python for a business use case."
        },
        audience: ["Data Scientists", "Advanced Analysts", "Engineers"]
    },
    "da-bigdata": {
        id: "da-bigdata",
        title: "Big Data & Cloud Analytics (Advanced)",
        tagline: "Work with large-scale data using big data and cloud technologies.",
        level: "Advanced",
        duration: "4 Weeks",
        lessons: 12,
        projects: 1,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        overview: "Understand how large-scale data is processed using big data and cloud technologies.",
        outcomes: [
            "Understand big data ecosystems",
            "Work conceptually with cloud data platforms"
        ],
        curriculum: [
            { module: "Module 1: Big Data", topics: ["Big data concepts"] },
            { module: "Module 2: Frameworks", topics: ["Spark & Hadoop fundamentals"] },
            { module: "Module 3: Cloud DWH", topics: ["Cloud data warehouses (AWS, GCP, Snowflake)"] },
            { module: "Module 4: Operations", topics: ["Querying large datasets"] }
        ],
        tools: [
            { name: "Spark", icon: Layers },
            { name: "Cloud Platforms", icon: Globe }
        ],
        project: {
            title: "Big Data Processing",
            description: "Work on sample big data processing scenarios."
        },
        audience: ["Data Engineers", "Architects", "Senior Analysts"]
    },
    "da-capstone": {
        id: "da-capstone",
        title: "Capstone & Real-World Project",
        tagline: "End-to-end analytics project to showcase skills and build a portfolio.",
        level: "Advanced",
        duration: "4 Weeks",
        lessons: 5,
        projects: 1,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
        overview: "A complete end-to-end analytics project to showcase skills and build a portfolio.",
        outcomes: [
            "Apply analytics skills in real scenarios",
            "Present insights professionally"
        ],
        curriculum: [
            { module: "Phase 1: Definition", topics: ["Business problem definition"] },
            { module: "Phase 2: Preparation", topics: ["Data cleaning (Excel / SQL / Python)"] },
            { module: "Phase 3: Analysis", topics: ["Analysis & visualization (Power BI / Tableau)"] },
            { module: "Phase 4: Delivery", topics: ["Insights & final presentation", "Portfolio-ready project", "Presentation deck"] }
        ],
        tools: [
            { name: "All Tools", icon: Brain }
        ],
        project: {
            title: "Portfolio Project",
            description: "Deliver a complete portfolio-ready project and presentation deck."
        },
        audience: ["All Learners", "Job Seekers"]
    },

    // AIML Courses
    "aiml-python": {
        id: "aiml-python",
        title: "Python for AI & ML",
        tagline: "Learn Python programming and libraries required for AI & ML development.",
        level: "Beginner",
        duration: "4 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200",
        overview: "Learn Python programming and libraries required for AI & ML development.",
        outcomes: [
            "Write clean Python code",
            "Handle and analyze datasets",
            "Prepare data for ML models"
        ],
        curriculum: [
            { module: "Module 1: Python Fundamentals", topics: ["Variables, loops, functions", "Lists & dictionaries", "File handling"] },
            { module: "Module 2: Data Handling", topics: ["NumPy arrays", "Pandas DataFrames", "Data cleaning"] },
            { module: "Module 3: Data Visualization", topics: ["Matplotlib basics", "Seaborn plots", "EDA techniques"] },
            { module: "Module 4: Object-Readiness Programming", topics: ["Classes & objects", "Inheritance", "Code structure"] },
            { module: "Module 5: Project Practice", topics: ["Mini ML project", "Data preprocessing pipeline", "Visualization dashboard"] }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "NumPy", icon: Code },
            { name: "Pandas", icon: Code },
            { name: "Matplotlib", icon: BarChart },
            { name: "Jupyter", icon: Terminal }
        ],
        project: {
            title: "Data Preprocessing Pipeline",
            description: "Build a complete data preprocessing pipeline for a machine learning dataset."
        },
        audience: ["Beginners", "Data Analysts", "Developers"]
    },
    "aiml-math": {
        id: "aiml-math",
        title: "Mathematics & Statistics for ML",
        tagline: "Understand the mathematical foundation behind ML algorithms.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 15,
        projects: 0,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200",
        overview: "Understand the mathematical foundation behind ML algorithms.",
        outcomes: [
            "Understand algorithm logic",
            "Improve model accuracy",
            "Apply math in ML"
        ],
        curriculum: [
            { module: "Module 1: Linear Algebra", topics: ["Vectors & matrices", "Matrix multiplication", "Eigenvalues basics"] },
            { module: "Module 2: Probability", topics: ["Random variables", "Bayes theorem", "Distributions"] },
            { module: "Module 3: Statistics", topics: ["Mean, variance", "Hypothesis testing", "Correlation"] },
            { module: "Module 4: Calculus Basics", topics: ["Derivatives", "Gradient descent concept", "Optimization"] },
            { module: "Module 5: Practical Applications", topics: ["Math behind regression", "Loss functions", "Optimization examples"] }
        ],
        tools: [
            { name: "Python (NumPy)", icon: Code },
            { name: "SciPy", icon: Code }
        ],
        project: {
            title: "Algorithm Implementation",
            description: "Implement basic ML algorithms from scratch using mathematical principles."
        },
        audience: ["ML Engineers", "Data Scientists", "Researchers"]
    },
    "aiml-core-ml": {
        id: "aiml-core-ml",
        title: "Core Machine Learning",
        tagline: "Build predictive models using fundamental ML algorithms.",
        level: "Intermediate",
        duration: "5 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200",
        overview: "Build predictive models using fundamental ML algorithms.",
        outcomes: [
            "Train ML models",
            "Evaluate performance",
            "Solve prediction problems"
        ],
        curriculum: [
            { module: "Module 1: Supervised Learning", topics: ["Linear Regression", "Logistic Regression", "KNN"] },
            { module: "Module 2: Classification Models", topics: ["Decision Trees", "Naive Bayes", "SVM basics"] },
            { module: "Module 3: Unsupervised Learning", topics: ["K-Means clustering", "PCA", "Hierarchical clustering"] },
            { module: "Module 4: Model Evaluation", topics: ["Accuracy & confusion matrix", "Cross validation", "ROC curve"] },
            { module: "Module 5: ML Project", topics: ["End-to-end ML workflow", "Model comparison", "Performance improvement"] }
        ],
        tools: [
            { name: "Scikit-learn", icon: Code },
            { name: "Pandas", icon: Code }
        ],
        project: {
            title: "Predictive Modeling",
            description: "Build and evaluate predictive models for a real-world dataset."
        },
        audience: ["Data Scientists", "ML Engineers", "Developers"]
    },
    "aiml-advanced-ml": {
        id: "aiml-advanced-ml",
        title: "Advanced Machine Learning",
        tagline: "Explore complex ML algorithms used in industry.",
        level: "Advanced",
        duration: "5 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
        overview: "Explore complex ML algorithms used in industry.",
        outcomes: [
            "Handle complex datasets",
            "Build recommendation systems",
            "Improve model performance"
        ],
        curriculum: [
            { module: "Module 1: Ensemble Learning", topics: ["Random Forest", "Gradient Boosting", "XGBoost basics"] },
            { module: "Module 2: Feature Engineering", topics: ["Feature selection", "Encoding techniques", "Dimensionality reduction"] },
            { module: "Module 3: Time Series Analysis", topics: ["Forecasting basics", "ARIMA model", "Seasonal trends"] },
            { module: "Module 4: Recommendation Systems", topics: ["Collaborative filtering", "Content-based filtering", "Real-world examples"] },
            { module: "Module 5: Advanced ML Project", topics: ["Industry-level case study", "Hyperparameter tuning", "Model optimization"] }
        ],
        tools: [
            { name: "XGBoost", icon: Layers },
            { name: "Scikit-learn", icon: Code }
        ],
        project: {
            title: "Advanced Recommendation System",
            description: "Build a recommendation system using advanced ML techniques."
        },
        audience: ["Senior Data Scientists", "ML Engineers"]
    },
    "aiml-deep-learning": {
        id: "aiml-deep-learning",
        title: "Deep Learning & Neural Networks",
        tagline: "Build advanced AI systems using neural networks.",
        level: "Advanced",
        duration: "6 Weeks",
        lessons: 25,
        projects: 1,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200",
        overview: "Build advanced AI systems using neural networks.",
        outcomes: [
            "Build neural networks",
            "Work on images & text",
            "Create deep learning solutions"
        ],
        curriculum: [
            { module: "Module 1: ANN Basics", topics: ["Perceptron", "Activation functions", "Backpropagation"] },
            { module: "Module 2: CNN", topics: ["Image processing", "Convolution layers", "Image classification"] },
            { module: "Module 3: RNN & LSTM", topics: ["Sequential data", "Time series prediction", "Language modeling"] },
            { module: "Module 4: Transfer Learning", topics: ["Pretrained models", "Fine-tuning", "Model reuse"] },
            { module: "Module 5: Deep Learning Project", topics: ["Image classifier", "NLP deep model", "Deployment basics"] }
        ],
        tools: [
            { name: "TensorFlow", icon: Layers },
            { name: "Keras", icon: Layers },
            { name: "PyTorch", icon: Layers }
        ],
        project: {
            title: "Image Classification System",
            description: "Build a deep learning model for image classification."
        },
        audience: ["AI Engineers", "Deep Learning Researchers"]
    },
    "aiml-nlp": {
        id: "aiml-nlp",
        title: "Natural Language Processing",
        tagline: "Develop AI systems that understand human language.",
        level: "Advanced",
        duration: "5 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200",
        overview: "Develop AI systems that understand human language.",
        outcomes: [
            "Build chatbots",
            "Work with LLMs",
            "Analyze text data"
        ],
        curriculum: [
            { module: "Module 1: Text Processing", topics: ["Tokenization", "Stopwords removal", "Lemmatization"] },
            { module: "Module 2: Text Representation", topics: ["TF-IDF", "Word2Vec", "Embeddings"] },
            { module: "Module 3: NLP Applications", topics: ["Sentiment analysis", "Chatbots", "Spam detection"] },
            { module: "Module 4: Transformers", topics: ["BERT basics", "GPT overview", "Prompt engineering"] },
            { module: "Module 5: NLP Project", topics: ["AI chatbot", "Text summarizer", "Language translation"] }
        ],
        tools: [
            { name: "NLTK", icon: Code },
            { name: "SpaCy", icon: Code },
            { name: "Hugging Face", icon: Brain }
        ],
        project: {
            title: "AI Chatbot",
            description: "Develop an AI-powered chatbot using NLP techniques."
        },
        audience: ["NLP Engineers", "AI Researchers"]
    },
    "aiml-cv": {
        id: "aiml-cv",
        title: "Computer Vision & AI Systems",
        tagline: "Teach machines to understand images and videos.",
        level: "Advanced",
        duration: "5 Weeks",
        lessons: 20,
        projects: 1,
        image: "https://images.unsplash.com/photo-1535378437327-b714923e7f31?w=1200",
        overview: "Teach machines to understand images and videos.",
        outcomes: [
            "Build AI vision systems",
            "Develop detection models",
            "Work on real-time AI"
        ],
        curriculum: [
            { module: "Module 1: Image Processing", topics: ["Pixel manipulation", "Filters", "Image enhancement"] },
            { module: "Module 2: Object Detection", topics: ["YOLO basics", "Bounding boxes", "Face recognition"] },
            { module: "Module 3: Video Analytics", topics: ["Frame extraction", "Real-time tracking", "Motion detection"] },
            { module: "Module 4: AI System Design", topics: ["AI pipelines", "Integration with ML", "Real-time applications"] },
            { module: "Module 5: Vision Project", topics: ["Face detection system", "Smart surveillance", "AI camera app"] }
        ],
        tools: [
            { name: "OpenCV", icon: Layers },
            { name: "TensorFlow", icon: Layers },
            { name: "YOLO", icon: Layers }
        ],
        project: {
            title: "Face Recognition System",
            description: "Build a real-time face recognition system."
        },
        audience: ["Computer Vision Engineers", "AI Developers"]
    },
    "aiml-mlops": {
        id: "aiml-mlops",
        title: "MLOps & AI Deployment",
        tagline: "Deploy AI models into production environments.",
        level: "Advanced",
        duration: "4 Weeks",
        lessons: 15,
        projects: 1,
        image: "https://images.unsplash.com/photo-1667372393119-c85c02088981?w=1200",
        overview: "Deploy AI models into production environments.",
        outcomes: [
            "Deploy ML models",
            "Build production-ready AI systems",
            "Understand industry workflow"
        ],
        curriculum: [
            { module: "Module 1: Model Deployment", topics: ["Flask API", "FastAPI basics", "Web integration"] },
            { module: "Module 2: Cloud Deployment", topics: ["AWS basics", "Azure AI", "Google Cloud"] },
            { module: "Module 3: Docker & CI/CD", topics: ["Containerization", "Version control", "Model monitoring"] },
            { module: "Module 4: AI Ethics & Security", topics: ["Bias detection", "Data privacy", "Responsible AI"] },
            { module: "Module 5: Capstone Project", topics: ["End-to-end AIML project", "Deployment & documentation", "Industry presentation"] }
        ],
        tools: [
            { name: "Flask", icon: Code },
            { name: "Docker", icon: Layers },
            { name: "AWS", icon: Globe },
            { name: "GitHub", icon: Code }
        ],
        project: {
            title: "End-to-End MLOps Pipeline",
            description: "Build and deploy an end-to-end MLOps pipeline for a machine learning model."
        },
        audience: ["MLOps Engineers", "DevOps Engineers", "Data Scientists"]
    },

    // AI Courses
    "ai-fundamentals": {
        id: "ai-fundamentals",
        title: "Fundamentals of Artificial Intelligence",
        tagline: "Build a strong conceptual foundation in Artificial Intelligence.",
        level: "Beginner",
        duration: "4 Weeks",
        lessons: 12,
        projects: 1,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
        overview: "Start your journey into AI by understanding its core concepts, history, and types. Learn how intelligent agents work and how AI solves problems differently from humans.",
        outcomes: [
            "Understand core AI concepts and terminology",
            "Differentiate between Narrow, General, and Super AI",
            "Design basic intelligent agent architectures",
            "Analyze problems from an AI perspective"
        ],
        curriculum: [
            { module: "Module 1: Introduction", topics: ["Introduction to AI & History of AI", "Types of AI (Narrow, General, Super AI)"] },
            { module: "Module 2: Intelligent Agents", topics: ["Intelligent Agents & Agent Architecture", "AI vs Human Intelligence"] },
            { module: "Module 3: Problem Solving", topics: ["AI Problem Solving Approach"] }
        ],
        tools: [
            { name: "Python", icon: Code },
            { name: "Jupyter", icon: Terminal }
        ],
        project: {
            title: "Agent Simulation",
            description: "Design and simulate a simple intelligent agent environment."
        },
        audience: ["Beginners", "Students", "Managers"]
    },
    "ai-search": {
        id: "ai-search",
        title: "Problem Solving & Search Techniques",
        tagline: "Master the algorithms that power AI decision making.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 15,
        projects: 1,
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200",
        overview: "Dive deep into state space search algorithms, heuristics, and game playing techniques crucial for solving complex AI problems.",
        outcomes: [
            "Implement fundamental search algorithms (BFS, DFS, A*)",
            "Solve optimization problems using heuristic methods",
            "Create game-playing AI agents using Minimax",
            "Model problems using state space representation"
        ],
        curriculum: [
            { module: "Module 1: State Space", topics: ["State Space Representation"] },
            { module: "Module 2: Uninformed Search", topics: ["Search Algorithms (BFS, DFS)"] },
            { module: "Module 3: Informed Search", topics: ["Heuristic Methods", "A* Algorithm", "Optimization Techniques"] },
            { module: "Module 4: Game Playing", topics: ["Game Playing AI (Minimax concept)"] }
        ],
        tools: [
            { name: "Python", icon: Code }
        ],
        project: {
            title: "Maze Solver & Game Bot",
            description: "Build an AI that solves mazes using A* and plays Tic-Tac-Toe using Minimax."
        },
        audience: ["Developers", "CS Students"]
    },
    "ai-knowledge": {
        id: "ai-knowledge",
        title: "Knowledge Representation & Reasoning",
        tagline: "Learn how AI systems store knowledge and reason with it.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 14,
        projects: 1,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200",
        overview: "Explore how to represent real-world knowledge formally and build systems that can reason, infer, and handle uncertainty.",
        outcomes: [
            "Represent knowledge using logic (Propositional & Predicate)",
            "Build rule-based expert systems",
            "Apply inference mechanisms to derive new knowledge",
            "Handle uncertainty using basic Bayesian concepts"
        ],
        curriculum: [
            { module: "Module 1: Logic", topics: ["Propositional & Predicate Logic"] },
            { module: "Module 2: Expert Systems", topics: ["Rule-Based Systems", "Expert Systems"] },
            { module: "Module 3: Inference", topics: ["Inference Mechanisms"] },
            { module: "Module 4: Uncertainty", topics: ["Handling Uncertainty (Bayesian Basics)"] }
        ],
        tools: [
            { name: "Prolog", icon: Code },
            { name: "Python", icon: Code }
        ],
        project: {
            title: "Expert Diagnostic System",
            description: "Develop a rule-based expert system for basic medical or technical diagnosis."
        },
        audience: ["AI Enthusiasts", "Logic Designers"]
    },
    "ai-intel-basics": {
        id: "ai-intel-basics",
        title: "Machine Intelligence Basics",
        tagline: "A foundational overview of machine learning concepts within AI.",
        level: "Beginner",
        duration: "3 Weeks",
        lessons: 10,
        projects: 1,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
        overview: "Get introduced to machine learning as a subset of AI. Understand the types of learning, pattern recognition, and basic evaluation metrics.",
        outcomes: [
            "Understand the role of ML in the broader AI landscape",
            "Distinguish between supervised and unsupervised learning",
            "Grasp core concepts like Decision Trees and Pattern Recognition",
            "Evaluate basic model performance conceptually"
        ],
        curriculum: [
            { module: "Module 1: ML Overview", topics: ["What is Machine Learning in AI"] },
            { module: "Module 2: Learning Types", topics: ["Supervised vs Unsupervised Learning (Overview)"] },
            { module: "Module 3: Patterns & Models", topics: ["Pattern Recognition", "Decision Trees Concept"] },
            { module: "Module 4: Evaluation", topics: ["Basic Model Evaluation Idea"] }
        ],
        tools: [
            { name: "Scikit-learn", icon: Code },
            { name: "Python", icon: Code }
        ],
        project: {
            title: "Simple Predictor",
            description: "Implement a basic Decision Tree classifier on a standard dataset."
        },
        audience: ["Beginners", "Data Analysts"]
    },
    "ai-nlp-vision": {
        id: "ai-nlp-vision",
        title: "Natural Language & Vision Systems",
        tagline: "Introduction to AI's ability to see and speak.",
        level: "Intermediate",
        duration: "4 Weeks",
        lessons: 16,
        projects: 1,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
        overview: "Learn the basics of how AI understands human language and interprets visual data through Natural Language Processing and Computer Vision.",
        outcomes: [
            "Understand the pipeline of NLP and Chatbots",
            "Grasp the fundamentals of Speech Recognition",
            "Learn basic Image Processing and Object Detection concepts",
            "Apply pre-built models for simple text and image tasks"
        ],
        curriculum: [
            { module: "Module 1: NLP Basics", topics: ["Natural Language Understanding Basics", "Chatbot Fundamentals"] },
            { module: "Module 2: Speech", topics: ["Speech Recognition Basics"] },
            { module: "Module 3: Computer Vision", topics: ["Image Processing Introduction", "Object Detection Concept"] }
        ],
        tools: [
            { name: "NLTK", icon: Code },
            { name: "OpenCV", icon: Layers }
        ],
        project: {
            title: "Basic Chatbot or Detector",
            description: "Build a simple rule-based chatbot or a basic face detector."
        },
        audience: ["Developers", "Students"]
    },
    "ai-ethics": {
        id: "ai-ethics",
        title: "AI Applications, Ethics & Deployment",
        tagline: "Understanding the impact, responsibility, and lifecycle of AI.",
        level: "Beginner",
        duration: "3 Weeks",
        lessons: 10,
        projects: 1,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
        overview: "Study the real-world applications of AI across industries, along with the critical importance of ethics, bias, privacy, and deployment strategies.",
        outcomes: [
            "Analyze AI use cases in Healthcare, Finance, and Automation",
            "Identify ethical pitfalls, bias, and privacy concerns in AI",
            "Understand the components of AI System Architecture",
            "Learn the basics of deploying AI solutions responsibly"
        ],
        curriculum: [
            { module: "Module 1: Applications", topics: ["AI in Healthcare, Finance & Automation"] },
            { module: "Module 2: Architecture", topics: ["AI System Architecture"] },
            { module: "Module 3: Ethics & Responsibility", topics: ["Responsible AI & Ethics", "Bias & Data Privacy"] },
            { module: "Module 4: Deployment", topics: ["Introduction to AI Deployment"] }
        ],
        tools: [
            { name: "Case Studies", icon: BookOpen }
        ],
        project: {
            title: "AI Strategy Report",
            description: "Develop a strategy document for deploying an ethical AI solution in a chosen industry."
        },
        audience: ["Managers", "Business Leaders", "All Learners"]
    },
    "dm-job-guarantee": {
        id: "dm-job-guarantee",
        title: "Job Guarantee Digital Marketing Courses",
        tagline: "Gets you hired with 100% placement assistance.",
        level: "Beginner",
        duration: "3 Months",
        lessons: 40,
        projects: 5,
        image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200",
        overview: "Our Job Guarantee Digital Marketing Course is designed to transform beginners into industry-ready professionals. This intensive program covers all aspects of digital marketing including SEO, SEM, SMM, Email Marketing, and Analytics, coupled with rigorous interview preparation and guaranteed placement support.",
        outcomes: [
            "Master all core digital marketing channels",
            "Build a professional portfolio with real-world projects",
            "Gain hands-on experience with industry tools",
            "Secure a job in a top digital marketing agency or company",
            "Receive 100% placement support until you are hired"
        ],
        curriculum: [
            { module: "Module 1: Fundamentals", topics: ["Introduction to Digital Marketing", "Website Planning & Creation", "Content Strategy"] },
            { module: "Module 2: SEO Mastery", topics: ["On-Page & Off-Page SEO", "Technical SEO", "Local SEO & Google My Business"] },
            { module: "Module 3: Social Media", topics: ["Facebook & Instagram Ads", "LinkedIn Marketing", "Social Media Strategy"] },
            { module: "Module 4: Paid Advertising", topics: ["Google Ads (Search, Display, Video)", "PPC Strategy & Optimization", "Remarketing"] },
            { module: "Module 5: Analytics & Reporting", topics: ["Google Analytics 4", "Data Analysis & Reporting", "Conversion Rate Optimization"] },
            { module: "Module 6: Career Prep", topics: ["Resume Building", "Mock Interviews", "Portfolio Development", "Job Application Strategy"] }
        ],
        tools: [
            { name: "Google Analytics", icon: BarChart },
            { name: "Google Ads", icon: Globe },
            { name: "SEMrush", icon: Terminal },
            { name: "Meta Business Suite", icon: Layers }
        ],
        project: {
            title: "Live Client Strategy",
            description: "Develop and execute a comprehensive digital marketing strategy for a real-world client, demonstrating ROI."
        },
        audience: ["Job Seekers", "Students", "Career Switchers"]
    },
    "dm-online-offline": {
        id: "dm-online-offline",
        title: "Online / Offline Digital Marketing Courses",
        tagline: "Flexible learning modes to suit your lifestyle.",
        level: "Beginner",
        duration: "2 Months",
        lessons: 30,
        projects: 3,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
        overview: "Whether you prefer the convenience of online learning or the interactive environment of a classroom, our Online / Offline Digital Marketing Courses offer the same high-quality curriculum. Learn from expert mentors, work on live projects, and gain the skills needed to succeed in the digital world.",
        outcomes: [
            "Learn digital marketing concepts at your own pace (Online) or in-person (Offline)",
            "Gain practical skills through hands-on assignments",
            "Access recorded sessions and study materials anytime",
            "Network with peers and industry experts",
            "Receive certification upon course completion"
        ],
        curriculum: [
            { module: "Module 1: Digital Landscape", topics: ["Digital Marketing Overview", "Consumer Behavior", "Digital Channels"] },
            { module: "Module 2: Search Marketing", topics: ["SEO Basics", "Google Ads Fundamentals", "Keyword Research"] },
            { module: "Module 3: Social Media", topics: ["Social Media Platforms", "Content Creation", "Community Management"] },
            { module: "Module 4: Content & Email", topics: ["Content Marketing Strategy", "Email Marketing Basics", "Copywriting"] },
            { module: "Module 5: Analytics", topics: ["Measuring Success", "Google Analytics Basics", "Reporting"] }
        ],
        tools: [
            { name: "Canva", icon: Code },
            { name: "Google Data Studio", icon: PieChart },
            { name: "Mailchimp", icon: Globe }
        ],
        project: {
            title: "Brand Launch Campaign",
            description: "Create a digital launch plan for a new brand, including website, social media, and email components."
        },
        audience: ["Students", "Working Professionals", "Entrepreneurs", "Small Business Owners"]
    },
    "python-course-training-hyderabad": {
        id: "python-course-training-hyderabad",
        title: "Python Programming",
        tagline: "Learn Python programming with practical projects at NxGen Tech Academy in Hyderabad.",
        level: "Beginner",
        duration: "3 to 4 Months",
        lessons: 40,
        projects: 3,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200",
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
    }
};
