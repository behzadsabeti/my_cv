export const resumeData = {
  personalInfo: {
    name: "Behzad Sabeti",
    title: "AI / ML Engineer & Researcher",
    email: "bsabeti13@gmail.com",
    phone: "09302396969",
    linkedin: "https://www.linkedin.com/in/behzad-sabeti-70b999190/",
    github: "https://github.com/behzadsabeti"
  },
  education: [
    {
      degree: "MSc in Artificial Intelligence",
      institution: "Ferdowsi University of Mashhad",
      period: "2024 – Present",
      details: "Focusing on advanced machine learning, neural networks, and agentic workflows."
    },
    {
      degree: "BA in Computer Engineering",
      institution: "University of Birjand",
      period: "2019 – 2023",
      details: "Completed coursework in algorithms, database design, software engineering, and digital image processing."
    }
  ],
  experiences: [
    {
      role: "Researcher",
      organization: "Pattern Recognition Lab, Ferdowsi University of Mashhad",
      period: "Feb 2025 – Present",
      details: "Conducting advanced research in artificial intelligence, focusing on pattern recognition, text retrieval, and network analysis."
    },
    {
      role: "Teaching Assistant, Machine Learning",
      organization: "Ferdowsi University of Mashhad",
      period: "Feb 2026",
      details: "Assisted in grading, conducting practical lab sessions, and mentoring students in machine learning algorithms and implementations."
    }
  ],
  skills: [
    { category: "Programming", items: ["Python", "JavaScript", "C++"] },
    { category: "Frameworks", items: ["Django", "FastAPI", "Langchain", "Streamlit"] },
    { category: "Tools & Tech", items: ["Linux/Ubuntu", "Git", "Claude Code", "Hugging Face Models"] },
    { category: "Artificial Intelligence", items: ["RAG", "LLMs", "Recommender Systems", "Agentic development", "Vector Database"] }
  ],
  projects: [
    {
      title: "Expert-Finding & Retrieval System (Master's Thesis)",
      tech: "Graph analysis, Retrieval systems",
      details: "Designing a retrieval system for Ferdowsi University of Mashhad utilizing a 3-layer network architecture connecting experts, papers, and keywords."
    },
    {
      title: "FUM Research Rules Chatbot",
      tech: "Python, RAG, LLM",
      details: "Designed and developed an AI-powered chatbot to navigate and query Ferdowsi University of Mashhad (FUM) research guidelines and regulations."
    },
    {
      title: "Movie Recommender System",
      tech: "Python, FastAPI, Surprise, PostgreSQL",
      github: "https://github.com/behzadsabeti/movie_recommender",
      details: "Built a movie recommender using the SVD algorithm, served via FastAPI. Scaled to relational storage and high-speed API response."
    },
    {
      title: "Letterboxd Crawler",
      tech: "Python, Scrapy",
      github: "https://github.com/behzadsabeti/LetterboxdCrawler",
      details: "Scrapes Letterboxd for movie genres, themes, IMDB IDs, and rating histogram data for large-scale movie data analysis."
    },
    {
      title: "Barcode Detection",
      tech: "Python, OpenCV",
      github: "https://github.com/behzadsabeti/barcode_detection",
      details: "Barcode detection using traditional OpenCV image processing techniques; primary project for Digital Image Processing (2023)."
    }
  ],
  certifications: [
    {
      name: "Machine Learning Specialization",
      provider: "Stanford & DeepLearning.AI (Coursera)",
      details: "Supervised Learning, Advanced Learning Algorithms, Unsupervised Learning, Recommenders, Reinforcement Learning",
      link: "https://coursera.org/share/64d85e57fd2e7d9505479b5ecdfa6087"
    },
    {
      name: "Data Scientist with Python Track",
      provider: "DataCamp",
      details: "Comprehensive data science and analytical tracks with python visualization and scripting libraries.",
      link: "https://www.datacamp.com/statement-of-accomplishment/track/b6453fc00e5e20271fec8bb4cc45a1396599745a"
    },
    {
      name: "PostgreSQL for Everybody Specialization",
      provider: "Coursera",
      details: "Advanced database concepts, pgvector potential, scaling tables, and SQL relational querying.",
      link: "https://coursera.org/share/7a0ce436a9420f6f940c17ed2e5ee724"
    },
    {
      name: "Django for Everybody",
      provider: "University of Michigan (Coursera)",
      details: "Web development using Django framework, database models, templates, and views.",
      link: "https://coursera.org/share/7c99ec031a5df1581cc5392b567a7afc"
    }
  ]
};

// Flattened chunks for semantic vector search
export const searchChunks = [
  // Education
  { id: "edu-1", section: "Education", text: "MSc in Artificial Intelligence at Ferdowsi University of Mashhad (2024 – Present)" },
  { id: "edu-2", section: "Education", text: "BA in Computer Engineering at University of Birjand (2019 – 2023)" },
  
  // Experience
  { id: "exp-1", section: "Experience", text: "Researcher at Pattern Recognition Lab, Ferdowsi University of Mashhad. AI, pattern recognition, and retrieval." },
  { id: "exp-2", section: "Experience", text: "Teaching Assistant for Machine Learning at Ferdowsi University of Mashhad. Mentored students on ML algorithms." },
  
  // Skills
  { id: "skill-1", section: "Skills", text: "Programming Languages: Python, JavaScript, C++" },
  { id: "skill-2", section: "Skills", text: "Web Frameworks: Django, FastAPI, Langchain, Streamlit" },
  { id: "skill-3", section: "Skills", text: "Tools & Technologies: Linux/Ubuntu, Git, Claude Code, Hugging Face Models" },
  { id: "skill-4", section: "Skills", text: "Artificial Intelligence Expertise: RAG, LLMs, Recommender Systems, Agentic development, Vector Database" },
  
  // Projects
  { id: "proj-1", section: "Projects", text: "Master's Thesis: Expert-Finding & Retrieval System. Designing a 3-layer academic network (experts, papers, keywords) for FUM." },
  { id: "proj-2", section: "Projects", text: "FUM Research Rules Chatbot: AI-powered chatbot to query Ferdowsi University research guidelines and regulations using RAG." },
  { id: "proj-3", section: "Projects", text: "Movie Recommender System: Python, FastAPI, Surprise SVD algorithm, PostgreSQL database, hosted on Railway." },
  { id: "proj-4", section: "Projects", text: "Letterboxd Crawler: Python Scrapy spider to scrape movie genres, themes, IMDB IDs, and rating histogram." },
  { id: "proj-5", section: "Projects", text: "Barcode Detection: Python OpenCV digital image processing project to identify and decode barcodes." },
  
  // Certifications
  { id: "cert-1", section: "Certifications", text: "Machine Learning Specialization by Stanford & DeepLearning.AI on Coursera (Supervised/Unsupervised learning, Recommenders, RL)." },
  { id: "cert-2", section: "Certifications", text: "Data Scientist with Python Track on DataCamp (Data analysis, visualization, processing)." },
  { id: "cert-3", section: "Certifications", text: "PostgreSQL for Everybody Specialization on Coursera (SQL database schema, querying, design)." },
  { id: "cert-4", section: "Certifications", text: "Django for Everybody by University of Michigan on Coursera (Python web development, templates, databases)." }
];
