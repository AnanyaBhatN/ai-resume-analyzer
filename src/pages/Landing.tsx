import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, FileCheck2, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { APP_NAME } from '@/utils/constants'

const features = [
  { icon: Target, title: 'Match Scoring', desc: 'Get an instant overall match score against any job description.' },
  { icon: FileCheck2, title: 'ATS Optimization', desc: 'Know exactly how ATS systems will parse and rank your resume.' },
  { icon: BarChart3, title: 'Keyword Analysis', desc: 'See which critical keywords are missing from your resume.' },
  { icon: Zap, title: 'Actionable Feedback', desc: 'Grammar, formatting, and content suggestions you can apply today.' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Backed by Google Gemini for nuanced, human-quality analysis.' },
  { icon: ShieldCheck, title: 'Private by Design', desc: 'Your resumes and history are stored locally in your browser.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-primary-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-700">
              Log in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Google Gemini
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your resume, analyzed like a <span className="text-primary">recruiter would.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Upload your resume, paste a job description, and get an instant AI-powered breakdown of your match score,
            ATS compatibility, missing skills, and exactly what to fix.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Analyze My Resume — Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-primary-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  )
}
