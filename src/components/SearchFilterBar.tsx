'use client'

interface Props {
  total: number
}

export default function SearchFilterBar({ total }: Props) {
  return (
    <div className="flex items-center mb-4">
      <span className="text-xs text-[#d8d6d6] font-medium">{total} leads</span>
    </div>
  )
}
