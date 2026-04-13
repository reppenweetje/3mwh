'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Lead { id: string; bedrijf: string }
interface Props { leads: Lead[] }

export default function UploadClient({ leads }: Props) {
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [manifest, setManifest] = useState<Record<string, string>>({})
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function loadManifest() {
    const res = await fetch('/api/admin/documents')
    if (res.ok) setManifest(await res.json())
  }

  useEffect(() => { loadManifest() }, [])

  async function handleUpload() {
    if (!selectedLeadId || !file) {
      setMessage({ type: 'err', text: 'Selecteer een lead en een ZIP-bestand.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const form = new FormData()
      form.append('leadId', selectedLeadId)
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'ok', text: `Geüpload voor: ${leads.find(l => l.id === selectedLeadId)?.bedrijf}` })
        setFile(null)
        setSelectedLeadId('')
        if (fileRef.current) fileRef.current.value = ''
        await loadManifest()
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Upload mislukt' })
      }
    } catch {
      setMessage({ type: 'err', text: 'Er is een fout opgetreden.' })
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(leadId: string) {
    setDeleting(leadId)
    try {
      await fetch('/api/admin/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      })
      await loadManifest()
    } finally {
      setDeleting(null)
    }
  }

  const leadsWithDocs = leads.filter(l => manifest[l.id])
  const leadsWithoutDocs = leads.filter(l => !manifest[l.id])

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e8e8e8] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-[#9a9898] uppercase tracking-widest">
              Documenten beheren
            </span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-bold text-[#c8c8c8] hover:text-[#9a9898] uppercase tracking-widest transition-colors"
          >
            ← Terug naar dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Upload sectie */}
        <div className="mb-10">
          <h1 className="text-2xl font-black text-[#0f0f70] tracking-tight mb-1">ZIP uploaden</h1>
          <p className="text-sm text-[#9a9898] mb-6">
            Upload per lead een ZIP-bestand met alle bijbehorende documenten.
          </p>

          <div className="border border-[#e8e8e8] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0f0f70] uppercase tracking-wider mb-2">
                Lead
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#d8d6d6] text-[#0f0f70] bg-white text-sm font-medium focus:outline-none focus:border-[#1b23aa] focus:ring-2 focus:ring-[#1b23aa]/10 transition-colors"
              >
                <option value="">Selecteer een lead…</option>
                {leadsWithoutDocs.length > 0 && (
                  <optgroup label="Nog geen document">
                    {leadsWithoutDocs.map(l => (
                      <option key={l.id} value={l.id}>{l.bedrijf}</option>
                    ))}
                  </optgroup>
                )}
                {leadsWithDocs.length > 0 && (
                  <optgroup label="Document vervangen">
                    {leadsWithDocs.map(l => (
                      <option key={l.id} value={l.id}>{l.bedrijf} (vervangen)</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f0f70] uppercase tracking-wider mb-2">
                ZIP-bestand
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-[#4a4a4a] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#0f0f70] file:text-white hover:file:bg-[#1b23aa] file:cursor-pointer file:transition-colors"
              />
              {file && (
                <p className="text-xs text-[#9a9898] mt-1.5 font-medium">
                  {file.name} — {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                message.type === 'ok'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || !selectedLeadId || !file}
              className="px-6 py-3 bg-[#0f0f70] hover:bg-[#1b23aa] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors"
            >
              {uploading ? 'Uploaden…' : 'Upload ZIP'}
            </button>
          </div>
        </div>

        {/* Overzicht */}
        <div>
          <h2 className="text-sm font-bold text-[#0f0f70] uppercase tracking-widest mb-4">
            Geüploade documenten ({leadsWithDocs.length} van {leads.length})
          </h2>

          {leadsWithDocs.length > 0 && (
            <div className="border border-[#e8e8e8] rounded-xl overflow-hidden divide-y divide-[#f0f0f0] mb-4">
              {leadsWithDocs.map(lead => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0f0f70]">{lead.bedrijf}</p>
                    <p className="text-xs text-[#c8c8c8] font-mono mt-0.5">id: {lead.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ZIP aanwezig
                    </span>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={deleting === lead.id}
                      className="text-xs font-bold text-[#d8d6d6] hover:text-red-400 uppercase tracking-wide transition-colors disabled:opacity-40"
                    >
                      {deleting === lead.id ? '…' : 'Verwijderen'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leadsWithoutDocs.length > 0 && (
            <div className="border border-[#f0f0f0] rounded-xl overflow-hidden divide-y divide-[#f8f8f8]">
              {leadsWithoutDocs.map(lead => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-3">
                  <p className="text-sm text-[#9a9898] font-medium">{lead.bedrijf}</p>
                  <span className="text-xs text-[#d8d6d6] font-medium">Geen document</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
