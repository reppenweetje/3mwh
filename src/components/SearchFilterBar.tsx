'use client'

interface Props {
  total: number
}

export default function SearchFilterBar({ total }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs text-[#d8d6d6] font-medium">{total} leads</span>
      <a
        href="/data/overzicht-inschrijvingen.xlsx"
        download
        className="flex items-center gap-2 px-4 py-2 bg-[#0f0f70] hover:bg-[#1b23aa] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        Download overzicht inschrijvingen
      </a>
    </div>
  )
}
