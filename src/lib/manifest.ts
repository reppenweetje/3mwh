import { put, list } from '@vercel/blob'

export type Manifest = Record<string, string>

const MANIFEST_FILENAME = 'mwh-manifest.json'

async function findManifestUrl(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_FILENAME })
    return blobs[0]?.url ?? null
  } catch {
    return null
  }
}

export async function getManifest(): Promise<Manifest> {
  try {
    const url = await findManifestUrl()
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
    access: 'public',
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
