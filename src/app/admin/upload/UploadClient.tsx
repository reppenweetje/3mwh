'use client'

import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  bedrijf: string
  hasDoc: boolean
}

interface Props {
  leads: Lead[]
}

export default function DocsOverview({ leads: initialLeads }: Props) {
  const router = useRouter()

  const withDoc = initialLeads.filter((l) => l.hasDoc)
  const withoutDoc = initialLeads.filter((l) => !l.hasDoc)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e8e8e8] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 h-16 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9a9898] uppercase tracking-widest">
            Documenten beheren
          </span>
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-bold text-[#c8c8c8] hover:text-[#9a9898] uppercase tracking-widest transition-colors"
          >
            ← Terug naar dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-10">

        {/* Instructies */}
        <div>
          <h1 className="text-2xl font-black text-[#0f0f70] tracking-tight mb-1">
            ZIP-documenten toevoegen
          </h1>
          <p className="text-sm text-[#9a9898] mb-6">
            Sleep ZIP-bestanden in de <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded text-[#0f0f70] font-mono text-xs">docs/</code> map in Cursor.
            Gebruik de bestandsnaam uit de kolom hieronder. Daarna commit &amp; push naar GitHub — Vercel deployt automatisch.
          </p>

          <div className="border border-[#e8e8e8] rounded-xl overflow-hidden bg-[#fafafa]">
            <div className="grid grid-cols-[3rem_1fr_10rem_7rem] gap-4 px-6 py-3 bg-[#f2f2f2] border-b border-[#e8e8e8]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">ID</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Bedrijf</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Bestandsnaam</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Status</span>
            </div>
            <div className="divide-y divide-[#f0f0f0]">
              {initialLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-[3rem_1fr_10rem_7rem] gap-4 items-center px-6 py-4"
                >
                  <span className="text-xs font-mono text-[#c0c0c0]">{lead.id}</span>
                  <span className="text-sm font-semibold text-[#0f0f70] truncate">{lead.bedrijf}</span>
                  <code className="text-xs font-mono text-[#1b23aa] bg-[#f0f1ff] px-2 py-1 rounded">
                    {lead.id}.zip
                  </code>
                  {lead.hasDoc ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Aanwezig
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d0d0d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0] shrink-0" />
                      Ontbreekt
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stappen */}
        <div className="border border-[#e8e8e8] rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-[#0f0f70] uppercase tracking-widest">
            Werkwijze
          </h2>
          <ol className="space-y-3 text-sm text-[#4a4a4a]">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#0f0f70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>
                Open de <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded text-[#0f0f70] font-mono text-xs">docs/</code> map in de Cursor bestandsboom (links).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#0f0f70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>
                Sleep je ZIP-bestand erin. Hernoem het naar de juiste bestandsnaam uit de tabel hierboven (bijv. <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded text-[#0f0f70] font-mono text-xs">3.zip</code>).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#0f0f70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>
                Commit en push naar GitHub via de Source Control tab in Cursor (<kbd className="bg-[#f4f4f4] px-1.5 py-0.5 rounded text-xs font-mono">⌘ Shift G</kbd>).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#edff00] text-[#0f0f70] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
              <span>
                Vercel deployt automatisch — de download knop is direct actief op het dashboard.
              </span>
            </li>
          </ol>

          <div className="bg-[#fffbe6] border border-[#f0e68c] rounded-lg px-4 py-3 text-xs text-[#7a6a00] font-medium">
            <strong>Let op:</strong> GitHub heeft een limiet van 100 MB per bestand.
            Vercel deployment bundle max ~250 MB totaal. Voor grotere bestanden: neem contact op.
          </div>
        </div>

        {/* Samenvatting */}
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{withDoc.length}</p>
            <p className="text-[10px] text-[#9a9898] uppercase tracking-widest mt-1">Aanwezig</p>
          </div>
          <div className="w-px bg-[#e8e8e8]" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#c0c0c0]">{withoutDoc.length}</p>
            <p className="text-[10px] text-[#9a9898] uppercase tracking-widest mt-1">Ontbreekt</p>
          </div>
          <div className="w-px bg-[#e8e8e8]" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0f0f70]">{initialLeads.length}</p>
            <p className="text-[10px] text-[#9a9898] uppercase tracking-widest mt-1">Totaal</p>
          </div>
        </div>

      </div>
    </main>
  )
}
