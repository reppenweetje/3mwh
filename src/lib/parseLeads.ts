import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
import { Lead, AnswerItem } from './types'
import { QUESTION_MAP } from './questionMap'

function formatDate(raw: unknown): string {
  if (!raw) return ''
  const str = String(raw).trim()
  if (!str) return ''
  // Already a nice date string
  const d = new Date(str)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return str
}

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
  const candidates = QUESTION_MAP.filter((q) =>
    clean.includes(q.match.toLowerCase())
  )
  if (candidates.length === 0) return undefined
  // Prefer the most specific (longest) match to avoid false positives
  return candidates.reduce((a, b) => a.match.length >= b.match.length ? a : b)
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
    const ingediendOp = formatDate(ingediendRaw)

    leads.push({
      id: String(i + 1),
      bedrijf: bedrijf.replace(/&/g, 'en'),
      score,
      naam: String(row[naamCol] ?? '').trim().replace(/&/g, 'en'),
      email: String(row[emailCol] ?? '').trim(),
      ingediendOp,
      antwoorden,
    })
  }

  return leads.sort((a, b) => b.score - a.score)
}
