'use client'

import { useState, useMemo } from 'react'
import { Lead } from '@/lib/types'
import LeadRow from './LeadRow'
import LeadExpandedPanel from './LeadExpandedPanel'
import SearchFilterBar from './SearchFilterBar'

interface Props {
  leads: Lead[]
}

export default function AccordionTable({ leads }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score')

  const filtered = useMemo(() => {
    let result = [...leads]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((l) => l.bedrijf.toLowerCase().includes(q))
    }

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
  }, [leads, search, sortBy])

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        sortBy={sortBy}
        onSort={setSortBy}
        total={leads.length}
        filtered={filtered.length}
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
            <p className="text-sm text-[#c0c0c0] font-medium">Geen resultaten voor &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f0f0]">
            {filtered.map((lead, idx) => (
              <div key={lead.id}>
                <LeadRow
                  lead={lead}
                  isOpen={openId === lead.id}
                  onToggle={() => toggle(lead.id)}
                  rank={idx + 1}
                />
                {openId === lead.id && <LeadExpandedPanel lead={lead} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
