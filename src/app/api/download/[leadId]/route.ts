import { NextRequest, NextResponse } from 'next/server'
import AdmZip from 'adm-zip'
import { COOKIE_NAME } from '@/lib/auth'
import { jwtVerify } from 'jose'
import { docExists, docPath } from '@/lib/getDocs'
import { parseLeads } from '@/lib/parseLeads'

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
  return new TextEncoder().encode(secret)
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

// "10 apr. 2026 om 13:33" → "10 apr 2026"
function extractDate(str: string): string {
  const MONTHS: Record<string, string> = {
    jan: 'jan', feb: 'feb', mrt: 'mrt', apr: 'apr', mei: 'mei', jun: 'jun',
    jul: 'jul', aug: 'aug', sep: 'sep', okt: 'okt', nov: 'nov', dec: 'dec',
  }
  const m = str.match(/(\d{1,2})\s+([a-zA-Z]+)\.?\s+(\d{4})/)
  if (!m) return ''
  const month = MONTHS[m[2].toLowerCase()] ?? m[2].toLowerCase()
  return `${m[1]} ${month} ${m[3]}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { leadId } = await params
  if (!leadId) {
    return NextResponse.json({ error: 'leadId ontbreekt' }, { status: 400 })
  }

  if (!docExists(leadId)) {
    return NextResponse.json({ error: 'Geen document gevonden voor deze lead' }, { status: 404 })
  }

  const filePath = docPath(leadId)

  // Bouw mapnaam: "{Bedrijf} - {datum}" (zelfde als ZIP-bestandsnaam)
  const leads = parseLeads()
  const lead = leads.find((l) => l.id === leadId)
  const cleanDate = lead?.ingediendOp ? extractDate(lead.ingediendOp) : ''
  const folderName = `${lead?.bedrijf ?? `lead-${leadId}`}${cleanDate ? ` - ${cleanDate}` : ''}`
    .replace(/[/\\:*?"<>|]/g, '')
    .trim()

  try {
    // Lees originele ZIP
    const original = new AdmZip(filePath)
    const entries = original.getEntries()

    // Bepaal of er een gemeenschappelijke root-map is
    const topLevelNames = new Set(
      entries.map((e) => e.entryName.split('/')[0]).filter(Boolean)
    )
    const hasSingleRoot =
      topLevelNames.size === 1 &&
      entries.some((e) => e.isDirectory && e.entryName.split('/').length === 2)

    // Bouw nieuwe ZIP met correcte mapnaam
    const newZip = new AdmZip()

    for (const entry of entries) {
      if (entry.isDirectory) continue

      let relativePath = entry.entryName
      if (hasSingleRoot) {
        // Strip de bestaande root-mapnaam
        const oldRoot = [...topLevelNames][0]
        relativePath = relativePath.replace(new RegExp(`^${oldRoot}/`), '')
      }

      newZip.addFile(`${folderName}/${relativePath}`, entry.getData())
    }

    const buffer = newZip.toBuffer()

    // RFC 6266: ASCII fallback + UTF-8 geëncodeerde bestandsnaam
    const asciiName = folderName.replace(/[^\x20-\x7E]/g, '_') + '.zip'
    const encodedName = encodeURIComponent(folderName + '.zip')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fout bij ophalen document' }, { status: 500 })
  }
}
