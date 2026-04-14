import { NextRequest, NextResponse } from 'next/server'
import { createMultipartUpload, uploadPart, completeMultipartUpload } from '@vercel/blob'
import { setDocumentUrl } from '@/lib/manifest'
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 })

    const { action } = body

    if (action === 'start') {
      const { leadId, filename } = body
      if (!leadId || !filename) {
        return NextResponse.json({ error: 'leadId en filename zijn verplicht' }, { status: 400 })
      }
      const { key, uploadId } = await createMultipartUpload(
        `docs/lead-${leadId}-${filename}`,
        { access: 'public', contentType: 'application/zip' }
      )
      return NextResponse.json({ key, uploadId })
    }

    if (action === 'part') {
      const { key, uploadId, partNumber, data } = body
      if (!key || !uploadId || !partNumber || !data) {
        return NextResponse.json({ error: 'Ontbrekende velden voor part upload' }, { status: 400 })
      }
      const buffer = Buffer.from(data, 'base64')
      const part = await uploadPart(key, buffer, { key, uploadId, partNumber, access: 'public' })
      return NextResponse.json({ etag: part.etag })
    }

    if (action === 'complete') {
      const { key, uploadId, parts, leadId } = body
      if (!key || !uploadId || !parts || !leadId) {
        return NextResponse.json({ error: 'Ontbrekende velden voor complete' }, { status: 400 })
      }
      const blob = await completeMultipartUpload(key, parts, { key, uploadId, access: 'public' })
      await setDocumentUrl(leadId, blob.url)
      return NextResponse.json({ ok: true, url: blob.url })
    }

    return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
