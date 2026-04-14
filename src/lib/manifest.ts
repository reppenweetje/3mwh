import { put, list } from '@vercel/blob'

export type Manifest = Record<string, string>

const MANIFEST_FILENAME = 'mwh-manifest.json'

async function findManifestDownloadUrl(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_FILENAME })
    // downloadUrl is een signed URL die werkt voor private stores
    return blobs[0]?.downloadUrl ?? null
  } catch {
    return null
  }
}

export async function getManifest(): Promise<Manifest> {
  try {
    const url = await findManifestDownloadUrl()
    if (!url) return {}
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return {}
    return (await res.json()) as Manifest
  } catch {
    return {}
  }
}

export async function saveManifest(manifest: Manifest): Promise<void> {
  await put(MANIFEST_FILENAME, JSON.stringify(manifest), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
  })
}

export async function setDocumentUrl(leadId: string, blobUrl: string): Promise<void> {
  const manifest = await getManifest()
  manifest[leadId] = blobUrl
  await saveManifest(manifest)
}

export async function removeDocumentUrl(leadId: string): Promise<void> {
  const manifest = await getManifest()
  delete manifest[leadId]
  await saveManifest(manifest)
}
