# ResumeIQ — AI Resume Analyzer

A premium, production-ready SaaS web application that analyzes resumes against job descriptions using Google's Gemini API — delivering match scores, ATS compatibility, keyword gaps, and actionable improvement suggestions in seconds.

![Tech](https://img.shields.io/badge/React-19-2563EB) ![Tech](https://img.shields.io/badge/TypeScript-strict-3B82F6) ![Tech](https://img.shields.io/badge/Vite-6-60A5FA)

---

## Overview

ResumeIQ lets a candidate upload their resume (PDF, DOCX, or TXT), paste a target job description, and receive a detailed AI-generated breakdown of how well the resume matches the role — including an ATS parseability score, missing/matched keywords, section-by-section analysis, grammar and formatting feedback, and a final actionable recommendation. Every analysis is saved to a searchable local history, and a polished PDF report can be downloaded or printed at any time.

The UI is designed in a calming blue palette inspired by Linear, Notion, Stripe, and Google — minimal, modern, and fully responsive across desktop, tablet, and mobile.

## Screenshots

> Add screenshots of the Landing page, Dashboard, Analysis Report, and History views here after running the app locally.

```
/screenshots
  landing.png
  dashboard.png
  analysis-report.png
  history.png
```

## Features

- **Local authentication** — signup, login, "remember me," forgot password flow, protected routes, and persisted sessions (dummy/local — no backend required)
- **Beautiful dashboard** — stat cards, recent analyses, score snapshot, and quick actions
- **Resume upload** — drag & drop or browse, supports PDF / DOCX / TXT, with live parsing and preview
- **Job description input** — large text area with character counter, paste-from-clipboard, sample JD, and clear button
- **AI-powered analysis (Gemini)** — overall match score, ATS score, resume summary, strengths, weaknesses, missing skills, recommended skills, keyword analysis, grammar suggestions, formatting suggestions, and dedicated experience / education / project / certification breakdowns, plus a final recommendation
- **PDF reports** — download, print, and share (copy-to-clipboard summary) any analysis
- **History** — every analysis is saved locally, searchable, viewable, and deletable
- **Settings** — profile editing, Gemini API key management, theme & notification preferences, data export (JSON), and full data deletion
- **Polished UI system** — reusable buttons, inputs, cards, modals, circular score charts, progress bars, skill chips, keyword badges, loading skeletons, and toast notifications, all built with Tailwind CSS and animated with Framer Motion

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Forms & Validation | React Hook Form + Zod |
| State Management | Zustand |
| HTTP | Axios |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| AI | Google Gemini API |
| File Parsing | pdfjs-dist (PDF), mammoth (DOCX) |
| PDF Reports | jsPDF |
| Persistence | Browser LocalStorage |

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# then open .env and add your Gemini API key

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for production

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
  components/
    ui/            Reusable primitives (Button, Input, Card, Modal, CircularScore, ProgressBar, Chip, Skeleton, EmptyState)
    layout/         Navbar, Sidebar
    upload/         ResumeDropzone, JobDescriptionForm
    analysis/       AnalysisReport, AnalysisLoading
  pages/            Landing, Login, Signup, ForgotPassword, Dashboard, Analyze, History, Settings, NotFound
  hooks/            useAuth, useDebounce, useOnClickOutside
  services/         geminiService (AI), fileParser (PDF/DOCX/TXT extraction), pdfReport (PDF generation)
  layouts/          AuthLayout, DashboardLayout
  store/            authStore, analysisStore, historyStore, settingsStore, uiStore (Zustand)
  types/            Shared TypeScript types
  utils/            constants, validators (Zod schemas), cn (classnames helper)
  routes/           ProtectedRoute / PublicOnlyRoute guards
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-2.0-flash
```

Get a free Gemini API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey). Alternatively, users can paste their own API key directly in **Settings → Gemini API Key**, which is stored in their browser's local storage and takes priority at runtime.

## How to Run

1. `npm install`
2. `npm run dev`
3. Open the app, click **Get Started**, and create a local account (no real email/backend needed)
4. Go to **New Analysis**, upload a resume and paste a job description
5. Click **Analyze Resume** to get your AI-powered report

## Authentication Notes

This project ships with a **dummy, client-side authentication system** for demo purposes: accounts are stored in `localStorage`, and passwords are hashed with a simple non-cryptographic hash. This is intentional and appropriate for a demo/portfolio SaaS project — **do not use this auth approach in a real production system**. Swap in a real backend (e.g., Supabase, Firebase Auth, or a custom API) for production use.

## Future Improvements

- Real backend with persistent multi-device storage (Postgres/Supabase)
- Resume version comparison and score history trends over time
- Multi-resume support per job description
- Team/recruiter mode with candidate ranking
- Export analysis as branded, customizable PDF templates
- Dark mode theme implementation
- Streaming AI responses for faster perceived performance

## License

MIT License — free to use, modify, and distribute.
