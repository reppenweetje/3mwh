import { NextRequest, NextResponse } from 'next/server'
import { getManifest } from '@/lib/manifest'
import { COOKIE_NAME } from '@/lib/auth'
import { jwtVerify } from 'jose'

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
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const { leadId } = await params
  if (!leadId) {
    return NextResponse.json({ error: 'leadId ontbreekt' }, { status: 400 })
  }

  const manifest = await getManifest()
  const blobUrl = manifest[leadId]

  if (!blobUrl) {
    return NextResponse.json({ error: 'Geen document gevonden voor deze lead' }, { status: 404 })
  }

  // Fetch the blob server-side and stream it — URL is never exposed to browser
  const blobRes = await fetch(blobUrl)
  if (!blobRes.ok) {
    return NextResponse.json({ error: 'Document niet beschikbaar' }, { status: 502 })
  }

  const filename = blobUrl.split('/').pop() ?? `lead-${leadId}.zip`
  const contentLength = blobRes.headers.get('content-length')

  const headers = new Headers({
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
  })
  if (contentLength) headers.set('Content-Length', contentLength)

  return new NextResponse(blobRes.body, { status: 200, headers })
}
