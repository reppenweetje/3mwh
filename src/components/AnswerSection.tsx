import { AnswerItem } from '@/lib/types'

interface Props {
  category: string
  items: AnswerItem[]
}

function AnswerPill({ answer }: { answer: string }) {
  const val = answer.trim().toLowerCase()

  if (val === 'ja' || val === 'yes') {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0f0f70]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0f0f70] inline-block" />
        {answer}
      </span>
    )
  }
  if (val === 'nee' || val === 'no') {
    return (
      <span className="text-sm text-[#c0c0c0]">{answer}</span>
    )
  }
  return (
    <span className="text-sm text-[#4a4a4a] font-medium">{answer}</span>
  )
}

export default function AnswerSection({ category, items }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-[#1b23aa] rounded-full" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1b23aa]">
          {category}
        </h3>
      </div>

      <div className="divide-y divide-[#ebebf5]">
        {items.map((item) => (
          <div key={item.code} className="py-2.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-[10px] font-bold font-mono text-[#c8c8c8] mt-0.5 shrink-0 w-6">{item.code}</span>
              <span className="text-xs text-[#9a9898] leading-relaxed">{item.title}</span>
            </div>
            <div className="text-right shrink-0 ml-4">
              <AnswerPill answer={item.answer} />
              {item.bewijsstuk && item.bewijsstuk !== item.answer && (
                <p className="text-[10px] text-[#c0c0c0] mt-0.5">
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
