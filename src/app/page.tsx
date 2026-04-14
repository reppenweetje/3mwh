import Image from 'next/image'
import { parseLeads } from '@/lib/parseLeads'
import { getDocIds } from '@/lib/getDocs'
import AccordionTable from '@/components/AccordionTable'
import LogoutButton from '@/components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const leads = parseLeads()
  const docIds = getDocIds()

  const topScore = leads.length ? Math.max(...leads.map((l) => l.score)) : 0
  const metDocumenten = docIds.size

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Topbalk ─────────────────────────────────────────────── */}
      <header className="border-b border-[#e8e8e8] bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-[#9a9898] uppercase tracking-widest truncate">
            3e Merwedehaven
          </span>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <a
              href="/admin/upload"
              className="text-[10px] font-bold text-[#9a9898] hover:text-[#0f0f70] uppercase tracking-widest transition-colors hidden sm:block"
            >
              Documenten beheren
            </a>
            <a
              href="/admin/upload"
              className="text-[10px] font-bold text-[#9a9898] hover:text-[#0f0f70] uppercase tracking-widest transition-colors sm:hidden"
            >
              Docs
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="border-b border-[#e8e8e8] bg-[#0f0f70]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
          <div>
            <p className="text-xs font-bold text-[#edff00] uppercase tracking-widest mb-2">
              Inschrijvingen dashboard
            </p>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              3e Merwedehaven
            </h1>
          </div>
          <div className="flex items-center gap-5 sm:gap-8">
            <div className="text-left sm:text-right">
              <p className="text-3xl sm:text-4xl font-bold text-white">{leads.length}</p>
              <p className="text-[10px] text-[#ffffff66] uppercase tracking-widest mt-0.5">Inschrijvingen</p>
            </div>
            <div className="w-px h-8 sm:h-10 bg-[#ffffff20]" />
            <div className="text-left sm:text-right">
              <p className="text-3xl sm:text-4xl font-bold text-[#edff00]">{topScore}</p>
              <p className="text-[10px] text-[#ffffff66] uppercase tracking-widest mt-0.5">Hoogste score</p>
            </div>
            {metDocumenten > 0 && (
              <>
                <div className="w-px h-8 sm:h-10 bg-[#ffffff20]" />
                <div className="text-left sm:text-right">
                  <p className="text-3xl sm:text-4xl font-bold text-white">{metDocumenten}</p>
                  <p className="text-[10px] text-[#ffffff66] uppercase tracking-widest mt-0.5">Met documenten</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabel ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full flex-1">
        <AccordionTable leads={leads} docIds={[...docIds]} />
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#e8e8e8] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center gap-4">
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
