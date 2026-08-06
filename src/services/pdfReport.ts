import jsPDF from 'jspdf'
import type { AnalysisResult } from '@/types'

const PRIMARY = '#2563EB'
const TEXT = '#1F2937'
const MUTED = '#6B7280'

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5.2): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

export function generateAnalysisPdf(result: AnalysisResult): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 16
  const contentWidth = pageWidth - marginX * 2
  let y = 20

  const ensureSpace = (needed: number) => {
    if (y + needed > 280) {
      doc.addPage()
      y = 20
    }
  }

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 28, 'F')
  doc.setTextColor('#FFFFFF')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('ResumeIQ — Analysis Report', marginX, 17)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated ${new Date(result.createdAt).toLocaleString()}`, marginX, 24)

  y = 38
  doc.setTextColor(TEXT)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(`${result.jobTitle}${result.companyName ? ' · ' + result.companyName : ''}`, marginX, y)
  y += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(MUTED)
  doc.text(`Resume file: ${result.resumeFileName}`, marginX, y)
  y += 10

  // Scores
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(marginX, y, contentWidth, 22, 3, 3, 'F')
  doc.setTextColor(PRIMARY)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`${result.overallMatchScore}%`, marginX + 8, y + 14)
  doc.text(`${result.atsScore}%`, marginX + contentWidth / 2 + 8, y + 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(MUTED)
  doc.text('Overall Match Score', marginX + 8, y + 19)
  doc.text('ATS Score', marginX + contentWidth / 2 + 8, y + 19)
  y += 32

  const section = (title: string) => {
    ensureSpace(14)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(PRIMARY)
    doc.text(title, marginX, y)
    y += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(TEXT)
  }

  const bulletList = (items: string[]) => {
    items.forEach((item) => {
      ensureSpace(8)
      y = addWrappedText(doc, `• ${item}`, marginX, y, contentWidth)
      y += 1
    })
    y += 3
  }

  section('Resume Summary')
  y = addWrappedText(doc, result.resumeSummary, marginX, y, contentWidth)
  y += 6

  section('Strengths')
  bulletList(result.strengths)

  section('Weaknesses')
  bulletList(result.weaknesses)

  section('Missing Skills')
  bulletList(result.missingSkills.map((s) => `${s.skill} — ${s.reason}`))

  section('Recommended Skills')
  y = addWrappedText(doc, result.recommendedSkills.join(', '), marginX, y, contentWidth)
  y += 8

  section('Keyword Analysis')
  bulletList(
    result.keywordAnalysis.map(
      (k) => `${k.keyword} — ${k.found ? 'Found' : 'Missing'} (${k.importance} importance)`,
    ),
  )

  section('Grammar Suggestions')
  bulletList(result.grammarSuggestions)

  section('Formatting Suggestions')
  bulletList(result.formattingSuggestions)

  const sectionAnalysis = (title: string, sa: AnalysisResult['experienceAnalysis']) => {
    section(`${title} (Score: ${sa.score}/100)`)
    y = addWrappedText(doc, sa.summary, marginX, y, contentWidth)
    y += 2
    bulletList(sa.points)
  }

  sectionAnalysis('Experience Analysis', result.experienceAnalysis)
  sectionAnalysis('Education Analysis', result.educationAnalysis)
  sectionAnalysis('Project Analysis', result.projectAnalysis)
  sectionAnalysis('Certification Analysis', result.certificationAnalysis)

  section('Final Recommendation')
  y = addWrappedText(doc, result.finalRecommendation, marginX, y, contentWidth)

  return doc
}

export function downloadAnalysisPdf(result: AnalysisResult) {
  const doc = generateAnalysisPdf(result)
  doc.save(`ResumeIQ-Report-${result.jobTitle.replace(/\s+/g, '-')}-${Date.now()}.pdf`)
}
