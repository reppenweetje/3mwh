interface Props {
  leadId: string
}

export default function DocumentsButton({ leadId }: Props) {
  return (
    <a
      href={`/api/download/${leadId}`}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#edff00] hover:bg-[#d9eb00] text-[#0f0f70] font-bold text-sm uppercase tracking-wide transition-colors"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Download documenten
    </a>
  )
}
