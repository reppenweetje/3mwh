import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
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

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 })
  }

  const leadId = formData.get('leadId')
  const file = formData.get('file')

  if (!leadId || typeof leadId !== 'string') {
    return NextResponse.json({ error: 'leadId ontbreekt' }, { status: 400 })
  }

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Bestand ontbreekt' }, { status: 400 })
  }

  const filename = file instanceof File ? file.name : `lead-${leadId}.zip`

  if (!filename.endsWith('.zip')) {
    return NextResponse.json({ error: 'Alleen ZIP-bestanden zijn toegestaan' }, { status: 400 })
  }

  const blob = await put(`docs/lead-${leadId}-${filename}`, file, {
    access: 'public',
    allowOverwrite: true,
  })

  await setDocumentUrl(leadId, blob.url)

  return NextResponse.json({ ok: true, url: blob.url })
}
