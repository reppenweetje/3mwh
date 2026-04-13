import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
import { Lead, AnswerItem } from './types'
import { QUESTION_MAP } from './questionMap'

function normalise(str: unknown): string {
  if (str == null) return ''
  return String(str)
    .replace(/\*/g, '')
    .replace(/\_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchQuestion(header: string) {
  const clean = normalise(header).toLowerCase()
  return QUESTION_MAP.find((q) =>
    clean.includes(q.match.toLowerCase())
  )
}

export function parseLeads(): Lead[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'inschrijvingen.xlsx')
  const buffer = fs.readFileSync(filePath)
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: '',
    raw: false,
  })

  if (rows.length === 0) return []

  const headers = Object.keys(rows[0])

  // Build a map: header string → QuestionDef
  const headerToQuestion = new Map<string, ReturnType<typeof matchQuestion>>()
  for (const h of headers) {
    const match = matchQuestion(h)
    if (match) headerToQuestion.set(h, match)
  }

  // Find special columns by substring match (case-insensitive)
  function findHeader(substring: string): string | undefined {
    return headers.find((h) =>
      normalise(h).toLowerCase().includes(substring.toLowerCase())
    )
  }

  const bedrijfCol = findHeader('Bedrijf') ?? headers[0]
  const scoreCol = findHeader('Score') ?? ''
  const naamCol = findHeader('Naam') ?? ''
  const emailCol = findHeader('email') ?? ''
  const ingediendCol = findHeader('Ingediend op') ?? ''
  const bundleUrlCol = findHeader('Documents Bundle URL') ?? findHeader('Bundle URL') ?? ''

  const leads: Lead[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const bedrijf = String(row[bedrijfCol] ?? '').trim()
    if (!bedrijf) continue

    const scoreRaw = row[scoreCol]
    const score = scoreRaw !== '' ? Number(scoreRaw) : 0

    // Build answer items, pairing main question with its bewijsstuk
    const bewijsstukMap = new Map<string, string>()
    const mainAnswers: AnswerItem[] = []

    for (const [header, def] of headerToQuestion.entries()) {
      if (!def) continue
      const value = String(row[header] ?? '').trim()
      if (!value) continue

      if (def.isBewijsstuk && def.bewijsstukFor) {
        bewijsstukMap.set(def.bewijsstukFor, value)
      } else {
        mainAnswers.push({
          code: def.code,
          category: def.category,
          title: def.title,
          answer: value,
        })
      }
    }

    // Attach bewijsstukken to their parent answers
    const antwoorden: AnswerItem[] = mainAnswers.map((item) => ({
      ...item,
      bewijsstuk: bewijsstukMap.get(item.code),
    }))

    const ingediendRaw = row[ingediendCol]
    const ingediendOp = ingediendRaw ? String(ingediendRaw).trim() : ''

    const bundleUrl = bundleUrlCol ? String(row[bundleUrlCol] ?? '').trim() : ''

    leads.push({
      id: String(i + 1),
      bedrijf,
      score,
      naam: String(row[naamCol] ?? '').trim(),
      email: String(row[emailCol] ?? '').trim(),
      ingediendOp,
      documentsBundleUrl: bundleUrl || undefined,
      antwoorden,
    })
  }

  return leads.sort((a, b) => b.score - a.score)
}
