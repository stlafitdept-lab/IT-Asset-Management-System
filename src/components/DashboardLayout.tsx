'use client'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from './Sidebar'
import Image from 'next/image'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Image
          src="/logo.png"
          alt="Loading"
          width={48}
          height={48}
          priority
          style={{ objectFit: 'contain', opacity: 0.8, width: 48, height: 48 }}
          className="animate-pulse"
        />
        <div style={{ width: 20, height: 20, border: '2px solid rgba(0,112,243,0.3)', borderTopColor: '#0070f3', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    </div>
  )

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ paddingTop: 60 }} className="lg:!pt-0 lg:pl-[240px]">
        <main style={{ padding: 20, maxWidth: 1280, margin: '0 auto' }} className="sm:!p-[24px]">
          {children}
        </main>
      </div>
    </div>
  )
}