import { Lead } from '@/lib/types'

interface Props {
  lead: Lead
  isOpen: boolean
  onToggle: () => void
  rank: number
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 130) {
    return (
      <span className="inline-flex items-center justify-center min-w-[3.25rem] px-2.5 py-1.5 text-sm font-bold bg-[#edff00] text-[#0f0f70] rounded-md tabular-nums">
        {score}
      </span>
    )
  }
  if (score >= 100) {
    return (
      <span className="inline-flex items-center justify-center min-w-[3.25rem] px-2.5 py-1.5 text-sm font-bold border border-[#0f0f70]/20 text-[#0f0f70] rounded-md tabular-nums">
        {score}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center min-w-[3.25rem] px-2.5 py-1.5 text-sm font-bold text-[#9a9898] rounded-md tabular-nums">
      {score || '—'}
    </span>
  )
}

function splitDateTime(str: string): { date: string; time: string } {
  if (!str) return { date: '—', time: '' }
  // Format from parseLeads is "10 apr. 2026 om 13:33" or similar
  const parts = str.split(' om ')
  return { date: parts[0] ?? str, time: parts[1] ?? '' }
}

export default function LeadRow({ lead, isOpen, onToggle, rank }: Props) {
  const { date, time } = splitDateTime(lead.ingediendOp)

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      className={`cursor-pointer select-none transition-colors ${
        isOpen ? 'bg-[#f5f6ff]' : 'bg-white hover:bg-[#fafafa]'
      }`}
      onClick={onToggle}
    >
      <div className="grid grid-cols-[2.5rem_1fr_4.5rem_1fr_1fr_6.5rem_2.5rem] gap-4 items-center px-8 py-4">

        <span className="text-xs font-mono text-[#e0e0e0] tabular-nums">{rank}</span>

        <div className="min-w-0 pr-2">
          <p className="text-sm font-semibold text-[#0f0f70] truncate leading-snug">{lead.bedrijf}</p>
        </div>

        <ScoreBadge score={lead.score} />

        <p className="text-sm text-[#4a4a4a] truncate">{lead.naam || '—'}</p>

        <p className="text-sm text-[#9a9898] truncate">{lead.email || '—'}</p>

        <div className="leading-snug">
          <p className="text-sm text-[#4a4a4a]">{date}</p>
          {time && <p className="text-xs text-[#c0c0c0] mt-0.5">{time}</p>}
        </div>

        <div className="flex justify-end">
          <svg
            className={`w-3.5 h-3.5 text-[#c8c8c8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
