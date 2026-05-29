'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlinePlusCircle,
  HiOutlineWrenchScrewdriver,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import { useState } from 'react'
import Image from 'next/image'

const NAV = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HiOutlineSquares2X2,
    roles: ['admin', 'hr'],
  },
  {
    name: 'Assets',
    href: '/assets-list',
    icon: HiOutlineCube,
    roles: ['admin', 'hr'],
  },
  {
    name: 'Add Asset',
    href: '/assets-list/add',
    icon: HiOutlinePlusCircle,
    roles: ['admin', 'hr'],
  },
  {
    name: 'Replacements',
    href: '/replacements',
    icon: HiOutlineArrowPath,
    roles: ['admin', 'hr'],
  },
  {
    name: 'Maintenance',
    href: '/maintenance',
    icon: HiOutlineWrenchScrewdriver,
    roles: ['admin', 'hr'],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const nav = NAV.filter((n) => profile && n.roles.includes(profile.role))

  const Body = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'rgba(5,8,18,0.95)',
        backdropFilter: 'blur(10px) saturate(180%)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          height: 56,
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={28}
          height={28}
          style={{ objectFit: 'contain', width: 28, height: 28, flexShrink: 0 }}
        />
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              margin: 0,
            }}
          >
            Asset Manager
          </p>
          <p
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            IT Management
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 16px 6px' }}>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            margin: 0,
          }}
        >
          Menu
        </p>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: '0 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s',
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'rgba(0,112,243,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(0,112,243,0.2)' : 'transparent'
                  }`,
                boxShadow: active
                  ? '0 0 12px rgba(0,112,243,0.06)'
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.background = 'rgba(0,112,243,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(0,112,243,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
            >
              <item.icon
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  color: active ? '#0070f3' : 'var(--text-muted)',
                }}
              />
              {item.name}
              {active && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#0070f3',
                    boxShadow: '0 0 8px #0070f3',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: 8,
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--glass-border)',
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'rgba(0,112,243,0.1)',
              border: '1px solid rgba(0,112,243,0.15)',
            }}
          >
            {isAdmin ? (
              <HiOutlineShieldCheck
                style={{ width: 14, height: 14, color: '#0070f3' }}
              />
            ) : (
              <HiOutlineUserGroup
                style={{ width: 14, height: 14, color: '#00d4ff' }}
              />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {profile?.full_name || profile?.email?.split('@')[0]}
            </p>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: '#0070f3',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              {profile?.role}
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fca5a5'
            e.currentTarget.style.background = 'rgba(239,68,68,0.04)'
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <HiOutlineArrowRightOnRectangle
            style={{ width: 14, height: 14 }}
          />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 50,
          padding: 10,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        <HiOutlineBars3 style={{ width: 20, height: 20, color: '#fff' }} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(2,5,12,0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          zIndex: 50,
          width: 240,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: 6,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <HiOutlineXMark
            style={{ width: 16, height: 16, color: 'var(--text-muted)' }}
          />
        </button>
        {Body}
      </div>

      {/* Desktop sidebar */}
      <div
        className="hidden lg:flex lg:flex-col"
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          width: 240,
          borderRight: '1px solid var(--border)',
        }}
      >
        {Body}
      </div>
    </>
  )
}