import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob'
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
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (_pathname, clientPayload) => {
      return {
        allowedContentTypes: [
          'application/zip',
          'application/x-zip-compressed',
          'application/octet-stream',
        ],
        maximumSizeInBytes: 100 * 1024 * 1024,
        tokenPayload: clientPayload ?? '',
      }
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      const { leadId } = JSON.parse(tokenPayload ?? '{}')
      if (leadId) {
        await setDocumentUrl(leadId, blob.url)
      }
    },
  })

  return NextResponse.json(jsonResponse)
}
