import { NextRequest, NextResponse } from 'next/server'
import { getManifest, removeDocumentUrl } from '@/lib/manifest'
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

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }
  const manifest = await getManifest()
  return NextResponse.json(manifest)
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }
  const { leadId } = await request.json()
  if (!leadId) return NextResponse.json({ error: 'leadId ontbreekt' }, { status: 400 })
  await removeDocumentUrl(leadId)
  return NextResponse.json({ ok: true })
}
