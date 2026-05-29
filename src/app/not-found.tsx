import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, margin: 0, color: '#0070f3' }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '12px 0 8px' }}>Page Not Found</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px' }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}