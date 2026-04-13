'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Inloggen mislukt')
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex">

      {/* ── Linker brand panel ─────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#0f0f70] flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/repp-icon.png"
            alt="REPP logo"
            width={56}
            height={38}
            className="h-9 w-auto brightness-0 invert"
            priority
          />
          <span className="font-wordmark text-2xl font-bold text-white tracking-tight">repp</span>
        </div>

        {/* Midden tekst */}
        <div>
          <p className="text-xs font-bold text-[#edff00] uppercase tracking-widest mb-4">
            Inschrijvingen dashboard
          </p>
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
            3e Merwede<br />haven
          </h2>
          <p className="text-sm text-[#ffffff55] leading-relaxed max-w-xs">
            Beveiligde omgeving voor het bekijken en beoordelen van alle ingediende inschrijvingen.
          </p>
        </div>

        {/* Footer logo groot */}
        <Image
          src="/repp-icon.png"
          alt=""
          width={120}
          height={80}
          className="w-24 h-auto brightness-0 invert opacity-10"
          aria-hidden="true"
        />
      </div>

      {/* ── Rechter login panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image
              src="/repp-icon.png"
              alt="REPP logo"
              width={48}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <span className="font-wordmark text-xl font-bold text-[#0f0f70]">repp</span>
          </div>

          <p className="text-xs font-bold text-[#1b23aa] uppercase tracking-widest mb-1">3e Merwedehaven</p>
          <h1 className="text-2xl font-black text-[#0f0f70] mb-1 tracking-tight">Inloggen</h1>
          <p className="text-sm text-[#9a9898] mb-8">Vul je gegevens in om verder te gaan.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0f0f70] mb-2 uppercase tracking-wider">
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-white border border-[#d8d6d6] text-[#0f0f70] placeholder-[#d8d6d6] focus:outline-none focus:border-[#1b23aa] focus:ring-2 focus:ring-[#1b23aa]/10 transition-colors text-sm font-medium rounded-lg"
                placeholder="gebruikersnaam"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f0f70] mb-2 uppercase tracking-wider">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white border border-[#d8d6d6] text-[#0f0f70] placeholder-[#d8d6d6] focus:outline-none focus:border-[#1b23aa] focus:ring-2 focus:ring-[#1b23aa]/10 transition-colors text-sm font-medium rounded-lg"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0f0f70] hover:bg-[#1b23aa] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest transition-colors rounded-lg mt-2"
            >
              {loading ? 'Moment…' : 'Inloggen'}
            </button>
          </form>

          <p className="text-center text-xs text-[#d8d6d6] mt-10 font-medium uppercase tracking-widest">
            Alleen voor intern gebruik
          </p>
        </div>
      </div>
    </main>
  )
}
