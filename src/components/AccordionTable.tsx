'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { Lead } from '@/lib/types'
import LeadRow from './LeadRow'
import LeadExpandedPanel from './LeadExpandedPanel'
import SearchFilterBar from './SearchFilterBar'

type SortCol = 'bedrijf' | 'score' | 'naam' | 'email' | 'ingediendOp'

interface SortState {
  col: SortCol
  dir: 'asc' | 'desc'
}

// Parst "10 apr 2026, 13:33" → timestamp voor sorteren
function parseDateTs(str: string): number {
  const MONTHS: Record<string, number> = {
    jan: 0, feb: 1, mrt: 2, apr: 3, mei: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
  }
  const m = str.match(/(\d{1,2})\s+([a-zA-Z]+)\.?\s+(\d{4})(?:\D+(\d{2}):(\d{2}))?/)
  if (!m) return 0
  const month = MONTHS[m[2].toLowerCase()]
  if (month === undefined) return 0
  return new Date(
    parseInt(m[3]), month, parseInt(m[1]),
    m[4] ? parseInt(m[4]) : 0,
    m[5] ? parseInt(m[5]) : 0,
  ).getTime()
}

// Standaard sorteervolgorde per kolom
const DEFAULT_DIR: Record<SortCol, 'asc' | 'desc'> = {
  bedrijf: 'asc',
  score: 'desc',
  naam: 'asc',
  email: 'asc',
  ingediendOp: 'desc',
}

interface Props {
  leads: Lead[]
  docIds: string[]
}

function SortArrow({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) {
    return (
      <svg className="w-3 h-3 text-[#d0d0d0] ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      </svg>
    )
  }
  return (
    <svg className="w-3 h-3 text-[#0f0f70] ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      {dir === 'asc'
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />}
    </svg>
  )
}

export default function AccordionTable({ leads, docIds }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortState>({ col: 'score', dir: 'desc' })
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const docSet = useMemo(() => new Set(docIds), [docIds])

  const handleSort = useCallback((col: SortCol) => {
    setSort((prev) =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: DEFAULT_DIR[col] }
    )
  }, [])

  const sorted = useMemo(() => {
    const mult = sort.dir === 'asc' ? 1 : -1
    return [...leads].sort((a, b) => {
      switch (sort.col) {
        case 'bedrijf':    return a.bedrijf.localeCompare(b.bedrijf, 'nl') * mult
        case 'score':      return (a.score - b.score) * mult
        case 'naam':       return (a.naam || '').localeCompare(b.naam || '', 'nl') * mult
        case 'email':      return (a.email || '').localeCompare(b.email || '', 'nl') * mult
        case 'ingediendOp': {
          const da = parseDateTs(a.ingediendOp)
          const db = parseDateTs(b.ingediendOp)
          return (da - db) * mult
        }
      }
    })
  }, [leads, sort])

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => {
      const opening = prev !== id
      if (opening) {
        setTimeout(() => {
          rowRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
      return opening ? id : null
    })
  }, [])

  function ColHeader({ col, label, className }: { col: SortCol; label: string; className?: string }) {
    const active = sort.col === col
    return (
      <button
        onClick={() => handleSort(col)}
        className={`flex items-center text-[10px] font-bold uppercase tracking-widest transition-colors
          ${active ? 'text-[#0f0f70]' : 'text-[#b0b0b0] hover:text-[#0f0f70]'}
          ${className ?? ''}`}
      >
        {label}
        <SortArrow active={active} dir={sort.dir} />
      </button>
    )
  }

  return (
    <div>
      <SearchFilterBar total={sorted.length} />

      <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
        {/* Header — desktop */}
        <div className="hidden lg:grid grid-cols-[2.5rem_1fr_4.5rem_1fr_1fr_6.5rem_2.5rem] gap-4 items-center px-8 py-3 bg-[#f7f7f7] border-b border-[#e8e8e8]">
          <span />
          <ColHeader col="bedrijf" label="Bedrijf" />
          <ColHeader col="score" label="Score" />
          <ColHeader col="naam" label="Contactpersoon" />
          <ColHeader col="email" label="E-mail" />
          <ColHeader col="ingediendOp" label="Ingediend" />
          <span />
        </div>
        {/* Header — tablet */}
        <div className="hidden sm:grid lg:hidden grid-cols-[2rem_1fr_4rem_1fr_4rem_2rem] gap-3 items-center px-6 py-3 bg-[#f7f7f7] border-b border-[#e8e8e8]">
          <span />
          <ColHeader col="bedrijf" label="Bedrijf" />
          <ColHeader col="score" label="Score" />
          <ColHeader col="naam" label="Contact" />
          <ColHeader col="ingediendOp" label="Datum" />
          <span />
        </div>
        {/* Header — mobile */}
        <div className="sm:hidden flex items-center gap-3 px-4 py-3 bg-[#f7f7f7] border-b border-[#e8e8e8]">
          <span className="w-5" />
          <ColHeader col="bedrijf" label="Bedrijf" className="flex-1" />
          <ColHeader col="score" label="Score" />
          <span className="w-3.5" />
        </div>

        {sorted.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-sm text-[#c0c0c0] font-medium">Geen inschrijvingen gevonden.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f0f0]">
            {sorted.map((lead, idx) => (
              <div key={lead.id} ref={(el) => { rowRefs.current[lead.id] = el }}>
                <LeadRow
                  lead={lead}
                  isOpen={openId === lead.id}
                  onToggle={() => toggle(lead.id)}
                  rank={idx + 1}
                />
                {openId === lead.id && (
                  <LeadExpandedPanel lead={lead} hasDocument={docSet.has(lead.id)} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
