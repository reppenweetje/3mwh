import { AnswerItem } from '@/lib/types'

interface Props {
  category: string
  items: AnswerItem[]
}

function AnswerPill({ answer }: { answer: string }) {
  const val = answer.trim().toLowerCase()

  if (val === 'ja' || val === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f0f70]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0f0f70] shrink-0" />
        {answer}
      </span>
    )
  }
  if (val === 'nee' || val === 'no') {
    return <span className="text-sm text-[#c0c0c0] font-medium">{answer}</span>
  }
  return <span className="text-sm text-[#4a4a4a] font-semibold">{answer}</span>
}

export default function AnswerSection({ category, items }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-1 h-4 bg-[#1b23aa] rounded-full shrink-0" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1b23aa]">
          {category}
        </h3>
      </div>

      <div className="divide-y divide-[#f0f0f0]">
        {items.map((item) => (
          <div key={item.code} className="py-2.5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-[11px] font-bold font-mono text-[#c8c8c8] mt-0.5 shrink-0 w-6 tabular-nums">
                {item.code}
              </span>
              <span className="text-xs text-[#9a9898] leading-relaxed font-medium">{item.title}</span>
            </div>
            <div className="pl-9 sm:pl-0 sm:text-right sm:shrink-0 sm:max-w-[55%]">
              <AnswerPill answer={item.answer} />
              {item.bewijsstuk && item.bewijsstuk !== item.answer && (
                <p className="text-[11px] text-[#c0c0c0] mt-0.5 font-medium break-words">
                  bewijs: {item.bewijsstuk}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
