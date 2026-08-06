import type { FileKind } from '@/types'

export function detectFileKind(file: File): FileKind | null {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.txt')) return 'txt'
  return null
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.mjs?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.default

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
    fullText += pageText + '\n\n'
  }
  return fullText.trim()
}

async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

async function extractTextFromTxt(file: File): Promise<string> {
  return (await file.text()).trim()
}

export async function extractResumeText(file: File, kind: FileKind): Promise<string> {
  switch (kind) {
    case 'pdf':
      return extractTextFromPdf(file)
    case 'docx':
      return extractTextFromDocx(file)
    case 'txt':
      return extractTextFromTxt(file)
    default:
      throw new Error(`Unsupported file kind: ${kind}`)
  }
}
