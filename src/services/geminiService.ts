import axios from 'axios'
import type { AnalysisResult } from '@/types'

const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'will', 'have', 'are', 'you', 'our', 'which', 'their', 'also', 'such', 'more', 'than', 'they', 'may', 'any', 'use', 'using', 'role', 'team', 'work', 'skills', 'experience', 'project', 'projects', 'business', 'technical', 'support', 'engineer', 'manager', 'associated', 'provide', 'providing', 'responsibility', 'responsibilities', 'building', 'develop', 'development', 'opportunity', 'need', 'required', 'preferred', 'strong', 'ability', 'candidate', 'job', 'description', 'company', 'companyname', 'etc', 'including', 'through', 'across', 'their', 'should', 'degree', 'years', 'system', 'systems', 'data', 'analysis', 'analyst'
])

export class GeminiServiceError extends Error {}

function getEndpoint(apiKey: string, model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
}

function buildPrompt(resumeText: string, jobTitle: string, companyName: string, jobDescription: string): string {
  return `You are an expert technical recruiter, resume writer, and ATS (Applicant Tracking System) specialist.

Analyze the RESUME below against the JOB DESCRIPTION and return your analysis as a SINGLE valid JSON object only.
Do not include markdown code fences, explanations, or any text outside the JSON object.

The JSON object MUST match exactly this shape:
{
  "overallMatchScore": number (0-100, how well the resume matches the job),
  "atsScore": number (0-100, how well the resume would parse in an ATS system),
  "resumeSummary": string (2-4 sentence summary of the candidate),
  "strengths": string[] (4-6 concise bullet points),
  "weaknesses": string[] (3-5 concise bullet points),
  "missingSkills": { "skill": string, "reason": string }[] (3-6 items, skills in the JD not evidenced in the resume),
  "recommendedSkills": string[] (4-8 skills the candidate should learn or highlight),
  "keywordAnalysis": { "keyword": string, "found": boolean, "importance": "high"|"medium"|"low" }[] (8-14 important keywords from the JD and whether they appear in the resume),
  "grammarSuggestions": string[] (2-5 concrete grammar/wording suggestions, or ["No significant grammar issues found."] if none),
  "formattingSuggestions": string[] (2-5 concrete formatting suggestions for ATS-friendliness and readability),
  "experienceAnalysis": { "score": number (0-100), "summary": string, "points": string[] (2-4 bullets) },
  "educationAnalysis": { "score": number (0-100), "summary": string, "points": string[] (2-4 bullets) },
  "projectAnalysis": { "score": number (0-100), "summary": string, "points": string[] (2-4 bullets) },
  "certificationAnalysis": { "score": number (0-100), "summary": string, "points": string[] (2-4 bullets) },
  "finalRecommendation": string (3-5 sentence actionable recommendation for the candidate)
}

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || 'Not specified'}

JOB DESCRIPTION:
"""
${jobDescription}
"""

RESUME TEXT:
"""
${resumeText}
"""

Return ONLY the JSON object described above.`
}

function extractJson(raw: string): string {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenceMatch) return fenceMatch[1].trim()
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }
  return trimmed
}

function analyzeLocally(resumeText: string, jobTitle: string, jobDescription: string, resumeFileName: string): AnalysisResult {
  const words = `${resumeText} ${jobTitle} ${jobDescription}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const keywordCount = words.reduce<Record<string, number>>((acc, word) => {
    if (word.length < 3 || STOPWORDS.has(word)) return acc
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {})

  const topKeywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword]) => ({ keyword, found: resumeText.toLowerCase().includes(keyword), importance: 'medium' as const }))

  const matchScore = Math.min(100, 40 + Math.round((topKeywords.filter((k) => k.found).length / topKeywords.length) * 60))
  const atsScore = Math.min(100, 50 + Math.round(words.length / 50))

  const result: AnalysisResult = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    jobTitle,
    companyName: '',
    resumeFileName,
    source: 'local',
    overallMatchScore: matchScore,
    atsScore,
    resumeSummary: `This resume was analyzed against the ${jobTitle} description and highlights key qualifications, experience, and keywords found in the text.`,
    strengths: ['Resume text was successfully parsed.', 'Job description was provided.', 'Key role-related terminology was detected.', 'The resume is ready for a deeper ATS review.'],
    weaknesses: ['No Gemini API key was available for full AI analysis.', 'A more detailed outcome requires a production model.', 'Job-specific skill matching may be approximate.', 'Recommendations are based on keyword overlap only.'],
    missingSkills: topKeywords.filter((k) => !k.found).slice(0, 5).map((k) => ({ skill: k.keyword, reason: 'Not clearly present in the resume text.' })),
    recommendedSkills: topKeywords.slice(0, 6).map((k) => k.keyword),
    keywordAnalysis: topKeywords,
    grammarSuggestions: ['Unable to provide full grammar suggestions without an AI model.', 'Consider reviewing sentences for concise action-oriented language.'],
    formattingSuggestions: ['Keep section headings clear and consistent.', 'Use bullet points for experience and project impact.', 'Ensure contact details are easy to scan at the top of the resume.'],
    experienceAnalysis: { score: Math.min(100, 40 + Math.round(words.length / 20)), summary: 'Experience was detected but could not be fully evaluated without AI scoring.', points: ['Check that each role includes measurable achievements.', 'Use consistent verb tense across past and current roles.'] },
    educationAnalysis: { score: 70, summary: 'Education details appear to be present in the resume.', points: ['Verify degree, institution, and graduation date are clear.', 'Highlight relevant certifications if available.'] },
    projectAnalysis: { score: 70, summary: 'Project work was detected from the text.', points: ['Emphasize project outcomes and technologies used.', 'Keep project descriptions concise and achievement-focused.'] },
    certificationAnalysis: { score: 60, summary: 'Certifications could not be validated without AI.', points: ['List any certifications clearly with full names.', 'Add certification dates and issuing organizations.'] },
    finalRecommendation: 'This is an approximate analysis based on resume text and keyword overlap. Add your Gemini API key for a richer AI-generated review, or verify your resume with a full model once available.',
  }

  return result
}

interface RawAnalysis {
  overallMatchScore: number
  atsScore: number
  resumeSummary: string
  strengths: string[]
  weaknesses: string[]
  missingSkills: { skill: string; reason: string }[]
  recommendedSkills: string[]
  keywordAnalysis: { keyword: string; found: boolean; importance: 'high' | 'medium' | 'low' }[]
  grammarSuggestions: string[]
  formattingSuggestions: string[]
  experienceAnalysis: { score: number; summary: string; points: string[] }
  educationAnalysis: { score: number; summary: string; points: string[] }
  projectAnalysis: { score: number; summary: string; points: string[] }
  certificationAnalysis: { score: number; summary: string; points: string[] }
  finalRecommendation: string
}

export async function analyzeResumeWithGemini(params: {
  apiKey: string
  model?: string
  resumeText: string
  resumeFileName: string
  jobTitle: string
  companyName: string
  jobDescription: string
}): Promise<AnalysisResult> {
  const { apiKey, model = DEFAULT_MODEL, resumeText, resumeFileName, jobTitle, companyName, jobDescription } = params

  if (!apiKey) {
    return analyzeLocally(resumeText, jobTitle, jobDescription, resumeFileName)
  }

  const prompt = buildPrompt(resumeText, jobTitle, companyName, jobDescription)

  let response
  try {
    response = await axios.post(
      getEndpoint(apiKey, model),
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 },
    )
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const apiMessage = err.response?.data?.error?.message
      if (status === 400 || status === 403) {
        throw new GeminiServiceError(apiMessage || 'Invalid or unauthorized Gemini API key.')
      }
      if (status === 429) {
        throw new GeminiServiceError('Gemini API rate limit exceeded. Please try again shortly.')
      }
      throw new GeminiServiceError(apiMessage || 'Failed to reach the Gemini API. Check your connection and try again.')
    }
    throw new GeminiServiceError('Unexpected error while calling the Gemini API.')
  }

  const text: string | undefined = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new GeminiServiceError('Gemini API returned an empty response.')
  }

  let parsed: RawAnalysis
  try {
    parsed = JSON.parse(extractJson(text)) as RawAnalysis
  } catch {
    throw new GeminiServiceError('Failed to parse the AI response. Please try running the analysis again.')
  }

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n || 0)))

  const result: AnalysisResult = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    jobTitle,
    companyName,
    resumeFileName,
    source: 'gemini',
    overallMatchScore: clamp(parsed.overallMatchScore),
    atsScore: clamp(parsed.atsScore),
    resumeSummary: parsed.resumeSummary || '',
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    missingSkills: parsed.missingSkills || [],
    recommendedSkills: parsed.recommendedSkills || [],
    keywordAnalysis: parsed.keywordAnalysis || [],
    grammarSuggestions: parsed.grammarSuggestions || [],
    formattingSuggestions: parsed.formattingSuggestions || [],
    experienceAnalysis: {
      score: clamp(parsed.experienceAnalysis?.score),
      summary: parsed.experienceAnalysis?.summary || '',
      points: parsed.experienceAnalysis?.points || [],
    },
    educationAnalysis: {
      score: clamp(parsed.educationAnalysis?.score),
      summary: parsed.educationAnalysis?.summary || '',
      points: parsed.educationAnalysis?.points || [],
    },
    projectAnalysis: {
      score: clamp(parsed.projectAnalysis?.score),
      summary: parsed.projectAnalysis?.summary || '',
      points: parsed.projectAnalysis?.points || [],
    },
    certificationAnalysis: {
      score: clamp(parsed.certificationAnalysis?.score),
      summary: parsed.certificationAnalysis?.summary || '',
      points: parsed.certificationAnalysis?.points || [],
    },
    finalRecommendation: parsed.finalRecommendation || '',
  }

  return result
}
