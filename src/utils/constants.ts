export const APP_NAME = 'ResumeIQ'

export const STORAGE_KEYS = {
  USERS: 'resumeiq_users',
  SESSION: 'resumeiq_session',
  HISTORY: 'resumeiq_history_',
  SETTINGS: 'resumeiq_settings_',
  NOTIFICATIONS: 'resumeiq_notifications_',
} as const

export const SAMPLE_JOB_DESCRIPTION = `We are looking for a Frontend Engineer (React) to join our product team.

Responsibilities:
- Build and maintain responsive web applications using React, TypeScript, and Tailwind CSS
- Collaborate with designers to implement pixel-perfect, accessible UI components
- Write clean, reusable, and well-tested code
- Optimize applications for maximum speed and scalability
- Participate in code reviews and mentor junior engineers

Requirements:
- 3+ years of experience with React and modern JavaScript/TypeScript
- Strong understanding of REST APIs and asynchronous programming
- Experience with state management (Redux, Zustand, or similar)
- Familiarity with CI/CD pipelines and Git workflows
- Excellent communication and problem-solving skills
- Bachelor's degree in Computer Science or equivalent experience

Nice to have:
- Experience with Next.js or Vite
- Familiarity with testing frameworks like Jest or Vitest
- Prior experience in a SaaS/startup environment`

export const MAX_FILE_SIZE_MB = 10
export const ACCEPTED_FILE_TYPES = ['.pdf', '.docx', '.txt']
