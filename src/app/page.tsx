import Image from 'next/image'
import { parseLeads } from '@/lib/parseLeads'
import AccordionTable from '@/components/AccordionTable'
import LogoutButton from '@/components/LogoutButton'


export const dynamic = 'force-dynamic'

export default function HomePage() {
  const leads = parseLeads()

  const topScore = leads.length ? Math.max(...leads.map((l) => l.score)) : 0
  const metDocumenten = leads.filter((l) => l.documentsBundleUrl).length

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Topbalk ─────────────────────────────────────────────── */}
      <header className="border-b border-[#e8e8e8] bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* REPP drie ruiten icoon */}
            <div className="flex items-center gap-[5px]">
              <div className="w-4 h-4 bg-[#0f0f70] rotate-45" />
              <div className="w-2.5 h-2.5 bg-[#0f0f70] rotate-45" />
              <div className="w-3.5 h-3.5 bg-[#0f0f70] rotate-45" />
            </div>
            <div className="w-px h-5 bg-[#e8e8e8]" />
            <span className="text-xs font-semibold text-[#9a9898] uppercase tracking-widest">
              3e Merwedehaven
            </span>
          </div>

          <LogoutButton />
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="border-b border-[#e8e8e8] bg-[#0f0f70]">
        <div className="max-w-7xl mx-auto px-8 py-10 flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold text-[#edff00] uppercase tracking-widest mb-2">
              Inschrijvingen dashboard
            </p>
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              3e Merwedehaven
            </h1>
          </div>
          {/* Stats inline in hero */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{leads.length}</p>
              <p className="text-xs text-[#ffffff66] uppercase tracking-widest mt-0.5">Inschrijvingen</p>
            </div>
            <div className="w-px h-10 bg-[#ffffff20]" />
            <div className="text-right">
              <p className="text-4xl font-bold text-[#edff00]">{topScore}</p>
              <p className="text-xs text-[#ffffff66] uppercase tracking-widest mt-0.5">Hoogste score</p>
            </div>
            {metDocumenten > 0 && (
              <>
                <div className="w-px h-10 bg-[#ffffff20]" />
                <div className="text-right">
                  <p className="text-4xl font-bold text-white">{metDocumenten}</p>
                  <p className="text-xs text-[#ffffff66] uppercase tracking-widest mt-0.5">Met documenten</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabel ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-10 w-full flex-1">
        <AccordionTable leads={leads} />
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#e8e8e8] mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col items-center gap-4">
          <Image
            src="/logos-footer.png"
            alt="ROM-D, REPP en Gemeente Dordrecht"
            width={700}
            height={80}
            className="h-14 w-auto mx-auto"
            priority={false}
          />
          <p className="text-xs text-[#d8d6d6] font-medium uppercase tracking-widest">
            Alleen voor intern gebruik
          </p>
        </div>
      </footer>

    </main>
  )
}
