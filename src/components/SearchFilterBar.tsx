'use client'

interface Props {
  search: string
  onSearch: (v: string) => void
  sortBy: 'score' | 'date'
  onSort: (v: 'score' | 'date') => void
  total: number
  filtered: number
}

export default function SearchFilterBar({ search, onSearch, sortBy, onSort, total, filtered }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">

      <div className="relative flex-1 min-w-[240px]">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c8c8c8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Zoek op bedrijfsnaam…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-[#e8e8e8] text-[#0f0f70] placeholder-[#c8c8c8] focus:outline-none focus:border-[#1b23aa] focus:ring-2 focus:ring-[#1b23aa]/10 transition-colors text-sm font-medium"
        />
      </div>

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

      {search && filtered !== total && (
        <span className="text-xs text-[#c8c8c8] font-medium">
          {filtered} van {total}
        </span>
      )}
    </div>
  )
}
