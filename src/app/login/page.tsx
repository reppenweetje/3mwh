'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [project, setProject] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (project.trim().toLowerCase() !== '3e merwedehaven') {
      setError('Vul een correct project in')
      return
    }

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
    <main className="min-h-screen bg-[#f0f0f5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm shadow-xl rounded-2xl overflow-hidden">

        {/* ── Blauwe banner ──────────────────────────────────── */}
        <div className="bg-[#0f0f70] px-8 pt-8 pb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Inschrijvingen
          </h1>
          <p className="text-sm text-[#ffffffbb] leading-relaxed">
            Digitaal portaal voor de verwerking en resultaten van ingediende inschrijvingen.
          </p>
        </div>

        {/* ── Formulier ──────────────────────────────────────── */}
        <div className="bg-white px-8 py-8">
          <div className="w-full max-w-sm">

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0f0f70] mb-2 uppercase tracking-wider">
                Project
              </label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-[#d8d6d6] text-[#0f0f70] placeholder-[#d8d6d6] focus:outline-none focus:border-[#1b23aa] focus:ring-2 focus:ring-[#1b23aa]/10 transition-colors text-sm font-medium rounded-lg"
                placeholder="project"
              />
            </div>

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

        </div>
        </div>
      </div>
    </main>
  )
}
