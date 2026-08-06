# ResumeIQ — AI Resume Analyzer

> 🚀 AI-powered Resume Analyzer that evaluates ATS compatibility, compares resumes against job descriptions, identifies skill gaps, and generates personalized improvement suggestions using Google Gemini AI.

**🌐 Live Demo:** https://ai-resume-analyzer-alpha-lyart-64.vercel.app

**💻 GitHub Repository:** https://github.com/AnanyaBhatN/ai-resume-analyzer

---

# Overview

ResumeIQ is a modern AI-powered SaaS application that helps job seekers optimize their resumes for specific job roles. Users can upload their resume (PDF, DOCX, or TXT), paste a job description, and instantly receive an AI-generated analysis including ATS score, skill match, keyword gaps, formatting suggestions, and actionable recommendations.

The application is built using **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Google Gemini AI**, featuring a responsive and premium user interface inspired by Linear, Notion, and Stripe.

---

# Live Demo

🌍 **Application:** https://ai-resume-analyzer-alpha-lyart-64.vercel.app

---

# Screenshots

> Add screenshots after running the application locally.

```
screenshots/
├── landing-page.png
├── dashboard.png
├── analyze-page.png
├── analysis-report.png
├── history.png
└── settings.png
```

---

# Features

### Authentication

- Local Signup & Login
- Protected Routes
- Remember Me
- Forgot Password UI
- Session Persistence using Local Storage

### Resume Analysis

- Upload Resume (PDF, DOCX, TXT)
- Drag & Drop Upload
- Resume Preview
- Paste Job Description
- Sample Job Description
- Character Counter

### AI Analysis

- ATS Compatibility Score
- Resume Match Score
- Resume Summary
- Missing Skills
- Matching Skills
- Keyword Analysis
- Experience Evaluation
- Education Analysis
- Projects Review
- Certifications Review
- Grammar Suggestions
- Formatting Suggestions
- Final AI Recommendation

### Dashboard

- Recent Analyses
- Quick Actions
- Resume Statistics
- Match Score Overview

### History

- View Previous Analyses
- Search Analysis History
- Delete Records
- Persistent Local Storage

### Reports

- Download PDF Report
- Print Analysis
- Copy Summary

### Settings

- Profile Management
- Gemini API Key Management
- Theme Preferences
- Notification Settings
- Export Analysis Data
- Clear All Data

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Forms | React Hook Form |
| Validation | Zod |
| State Management | Zustand |
| AI | Google Gemini API |
| PDF Parsing | pdfjs-dist |
| DOCX Parsing | Mammoth |
| PDF Generation | jsPDF |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Vercel |
| Version Control | Git & GitHub |

---

# Folder Structure

```text
src
│
├── components
│   ├── analysis
│   ├── layout
│   ├── ui
│   └── upload
│
├── hooks
├── layouts
├── pages
├── routes
├── services
├── store
├── types
├── utils
│
├── App.tsx
└── main.tsx
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/AnanyaBhatN/ai-resume-analyzer.git
```

Navigate to the project

```bash
cd ai-resume-analyzer
```

Install dependencies

```bash
npm install
```

Create an environment file

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_GEMINI_MODEL=gemini-2.0-flash
```

Run the application

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_GEMINI_API_KEY | Google Gemini API Key |
| VITE_GEMINI_MODEL | Gemini Model (Default: gemini-2.0-flash) |

Generate your API key from:

https://aistudio.google.com/app/apikey

---

# Deployment

The application is deployed on **Vercel**.

Production URL:

**https://ai-resume-analyzer-alpha-lyart-64.vercel.app**

---

# Future Enhancements

- User Authentication with Firebase/Supabase
- Resume Version Comparison
- AI Cover Letter Generator
- Resume Builder
- Interview Question Generator
- Recruiter Dashboard
- Multi-language Resume Support
- Dark Mode
- Real-time AI Streaming
- Resume Score Trends
- Resume Templates

---

# License

Licensed under the **MIT License**.

---

# Author

**Ananya Bhat N**

📧 ananyabhatn@gmail.com

🔗 LinkedIn  
https://www.linkedin.com/in/ananya-bhat-n

💻 GitHub  
https://github.com/AnanyaBhatN
