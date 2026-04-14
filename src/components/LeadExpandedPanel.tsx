import { Lead } from '@/lib/types'
import { CATEGORY_ORDER } from '@/lib/questionMap'
import { getSummary } from '@/lib/summaries'
import AnswerSection from './AnswerSection'
import DocumentsButton from './DocumentsButton'

interface Props {
  lead: Lead
  hasDocument: boolean
}

export default function LeadExpandedPanel({ lead, hasDocument }: Props) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: lead.antwoorden.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0)

  const summary = getSummary(lead.bedrijf)

  return (
    <div className="bg-[#f5f6ff] border-t border-[#e0e2f0]">

      {/* Balk met meta + documentknop */}
      <div className="px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 sm:gap-6 border-b border-[#e0e2f0]">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-10">
          <div>
            <p className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-widest mb-1">Contactpersoon</p>
            <p className="text-sm font-semibold text-[#0f0f70]">{lead.naam || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-widest mb-1">E-mail</p>
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="text-sm font-semibold text-[#1b23aa] hover:underline underline-offset-2 break-all">
                {lead.email}
              </a>
            ) : (
              <p className="text-sm text-[#c0c0c0]">—</p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-widest mb-1">Ingediend op</p>
            <p className="text-sm font-semibold text-[#4a4a4a]">{lead.ingediendOp || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-widest mb-1">Score</p>
            <p className="text-sm font-bold text-[#0f0f70]">{lead.score}</p>
          </div>
        </div>

        <DocumentsButton leadId={lead.id} disabled={!hasDocument} />
      </div>

      {/* Samenvatting */}
      {summary && (
        <div className="px-4 sm:px-8 py-5 border-b border-[#e0e2f0]">
          <p className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-widest mb-2">Samenvatting</p>
          <p className="text-sm text-[#4a4a4a] leading-relaxed max-w-4xl">{summary}</p>
        </div>
      )}

      {/* Antwoorden */}
      <div className="px-4 sm:px-8 py-6">
        <div className="flex flex-col gap-6">
          {grouped.map((g) => (
            <AnswerSection key={g.category} category={g.category} items={g.items} />
          ))}
        </div>
      </div>

    </div>
  )
}
