'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] font-bold text-[#c8c8c8] hover:text-[#9a9898] uppercase tracking-widest transition-colors"
    >
      Uitloggen
    </button>
  )
}
