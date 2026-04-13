'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { Lead } from '@/lib/types'
import LeadRow from './LeadRow'
import LeadExpandedPanel from './LeadExpandedPanel'
import SearchFilterBar from './SearchFilterBar'

interface Props {
  leads: Lead[]
  manifest: Record<string, string>
}

export default function AccordionTable({ leads, manifest }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filtered = useMemo(() => {
    let result = [...leads]

    if (sortBy === 'score') {
      result.sort((a, b) => b.score - a.score)
    } else {
      result.sort((a, b) => {
        const da = new Date(a.ingediendOp).getTime() || 0
        const db = new Date(b.ingediendOp).getTime() || 0
        return db - da
      })
    }

    return result
  }, [leads, sortBy])

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => {
      const opening = prev !== id
      if (opening) {
        // Scroll de rij naar de bovenkant van het scherm na uitklappen
        setTimeout(() => {
          rowRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
      return opening ? id : null
    })
  }, [])

  return (
    <div>
      <SearchFilterBar
        sortBy={sortBy}
        onSort={setSortBy}
        total={filtered.length}
      />

      <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
        {/* Tabelheader */}
        <div className="grid grid-cols-[2.5rem_1fr_4.5rem_1fr_1fr_6.5rem_2.5rem] gap-4 items-center px-8 py-3 bg-[#f7f7f7] border-b border-[#e8e8e8]">
          <span />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Bedrijf</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Score</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Contactpersoon</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">E-mail</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0b0]">Ingediend</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-sm text-[#c0c0c0] font-medium">Geen inschrijvingen gevonden.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f0f0]">
            {filtered.map((lead, idx) => (
              <div key={lead.id} ref={(el) => { rowRefs.current[lead.id] = el }}>
                <LeadRow
                  lead={lead}
                  isOpen={openId === lead.id}
                  onToggle={() => toggle(lead.id)}
                  rank={idx + 1}
                />
                {openId === lead.id && (
                  <LeadExpandedPanel lead={lead} hasDocument={!!manifest[lead.id]} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
