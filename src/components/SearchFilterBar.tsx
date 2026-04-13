'use client'

interface Props {
  sortBy: 'score' | 'date'
  onSort: (v: 'score' | 'date') => void
  total: number
}

export default function SearchFilterBar({ sortBy, onSort, total }: Props) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center rounded-lg border border-[#e8e8e8] overflow-hidden bg-white">
        <button
          onClick={() => onSort('score')}
          className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            sortBy === 'score' ? 'bg-[#0f0f70] text-white' : 'text-[#9a9898] hover:text-[#0f0f70] hover:bg-[#f7f7f7]'
          }`}
        >
          Score
        </button>
        <div className="w-px h-5 bg-[#e8e8e8]" />
        <button
          onClick={() => onSort('date')}
          className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            sortBy === 'date' ? 'bg-[#0f0f70] text-white' : 'text-[#9a9898] hover:text-[#0f0f70] hover:bg-[#f7f7f7]'
          }`}
        >
          Datum
        </button>
      </div>
      <span className="text-xs text-[#d8d6d6] font-medium">{total} leads</span>
    </div>
  )
}
