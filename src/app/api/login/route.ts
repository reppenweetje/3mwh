import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { username, password } = body as { username?: string; password?: string }

  const validUsername = process.env.DASHBOARD_USERNAME
  const validPassword = process.env.DASHBOARD_PASSWORD

  if (
    !validUsername ||
    !validPassword ||
    username?.trim() !== validUsername ||
    password !== validPassword
  ) {
    return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 })
  }

  const token = await createSessionToken()

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return response
}
