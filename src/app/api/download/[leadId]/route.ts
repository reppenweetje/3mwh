import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
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

  // Bouw bestandsnaam: "{Bedrijf} - {datum}.zip"
  const leads = parseLeads()
  const lead = leads.find((l) => l.id === leadId)
  const rawDate = lead?.ingediendOp?.split(',')[0]?.trim() ?? ''
  const safeName = `${lead?.bedrijf ?? `lead-${leadId}`}${rawDate ? ` - ${rawDate}` : ''}`
    .replace(/[/\\:*?"<>|]/g, '')
    .trim()
  const filename = `${safeName}.zip`

  try {
    const stat = fs.statSync(filePath)
    const nodeStream = fs.createReadStream(filePath)

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) =>
          controller.enqueue(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
        )
        nodeStream.on('end', () => controller.close())
        nodeStream.on('error', (err) => controller.error(err))
      },
      cancel() {
        nodeStream.destroy()
      },
    })

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fout bij ophalen document' }, { status: 500 })
  }
}
