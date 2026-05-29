'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Asset, DashboardStats } from '@/types'
import {
  formatCurrency,
  getStatusColor,
  formatDateShort,
  getTypeLabel,
} from '@/lib/utils'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
  HiOutlineBanknotes,
  HiOutlineClock,
} from 'react-icons/hi2'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    available: 0,
    assigned: 0,
    repair: 0,
    totalValue: 0,
    byType: { laptop: 0, mobile: 0, printer: 0 },
  })
  const [recent, setRecent] = useState<Asset[]>([])
  const [maint, setMaint] = useState({ pending: 0, ongoing: 0, completed: 0 })
  const [replacementCount, setReplacementCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      // Assets
      const { data: assets } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (assets) {
        setStats({
          total: assets.length,
          available: assets.filter((a) => a.status === 'available').length,
          assigned: assets.filter((a) => a.status === 'assigned').length,
          repair: assets.filter((a) => a.status === 'repair').length,
          totalValue: assets.reduce((s, a) => s + Number(a.price), 0),
          byType: {
            laptop: assets.filter((a) => a.type === 'laptop').length,
            mobile: assets.filter((a) => a.type === 'mobile').length,
            printer: assets.filter((a) => a.type === 'printer').length,
          },
        })
        setRecent(assets.slice(0, 6))
      }

      // Maintenance
      const { data: m } = await supabase
        .from('maintenance_logs')
        .select('status')

      if (m) {
        setMaint({
          pending: m.filter((x) => x.status === 'pending').length,
          ongoing: m.filter((x) => x.status === 'ongoing').length,
          completed: m.filter((x) => x.status === 'completed').length,
        })
      }

      // Replacements count
      const { count } = await supabase
        .from('replacements')
        .select('*', { count: 'exact', head: true })

      setReplacementCount(count || 0)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 240,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: '2px solid rgba(0,112,243,0.3)',
            borderTopColor: '#0070f3',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      </div>
    )
  }

  const th: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 800,
    color: '#fff',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid var(--table-border)',
    background: 'var(--table-header-bg)',
  }

  const td: React.CSSProperties = {
    padding: '13px 16px',
    fontSize: 13,
    borderBottom: '1px solid var(--table-border-light)',
    color: '#fff',
  }

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid var(--glass-border)',
    borderRadius: 14,
    overflow: 'hidden',
  }

  return (
    <div
      className="animate-fadeIn"
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#0070f3',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 4,
            }}
          >
            Overview
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 4,
            }}
          >
            Monitor your IT asset inventory
          </p>
        </div>

        <Link
          href="/assets-list"
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <HiOutlineCube size={15} />
          View All Assets
        </Link>
      </div>

      {/* Main Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          title="Total Assets"
          value={stats.total}
          icon={<HiOutlineCube size={20} style={{ color: '#0070f3' }} />}
          iconBg="rgba(0,112,243,0.12)"
        />
        <StatCard
          title="Available"
          value={stats.available}
          icon={
            <HiOutlineCheckCircle size={20} style={{ color: '#34d399' }} />
          }
          iconBg="rgba(52,211,153,0.12)"
        />
        <StatCard
          title="Assigned"
          value={stats.assigned}
          icon={<HiOutlineUserGroup size={20} style={{ color: '#60a5fa' }} />}
          iconBg="rgba(96,165,250,0.12)"
        />
        <StatCard
          title="Under Repair"
          value={stats.repair}
          icon={
            <HiOutlineWrenchScrewdriver
              size={20}
              style={{ color: '#f87171' }}
            />
          }
          iconBg="rgba(248,113,113,0.12)"
        />
      </div>

      {/* Second Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={<HiOutlineBanknotes size={20} style={{ color: '#34d399' }} />}
          iconBg="rgba(52,211,153,0.12)"
          subtitle="Philippine Peso (₱)"
        />

        <StatCard
          title="Active Maintenance"
          value={maint.pending + maint.ongoing}
          icon={<HiOutlineClock size={20} style={{ color: '#fbbf24' }} />}
          iconBg="rgba(251,191,36,0.12)"
          subtitle={`${maint.pending} pending · ${maint.ongoing} ongoing · ${maint.completed} done`}
        />

        {/* Assets by Type */}
        <div className="glass" style={{ padding: 18 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 14px',
            }}
          >
            Assets by Type
          </p>

          {Object.entries(stats.byType).map(([type, count]) => {
            const pct = Math.round(
              (count / (stats.total || 1)) * 100
            )
            return (
              <div key={type} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {count}{' '}
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        fontWeight: 400,
                      }}
                    >
                      ({pct}%)
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background:
                        'linear-gradient(90deg, #0070f3, #00d4ff)',
                      borderRadius: 99,
                      transition: 'width 0.6s',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Assets Table */}
      <div style={card}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid var(--table-border)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                margin: 0,
              }}
            >
              Recent Assets
            </h2>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              Latest additions
            </p>
          </div>

          <Link
            href="/assets-list"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#0070f3',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Asset ID</th>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={{ ...th, textAlign: 'right' }}>Price</th>
                <th style={th}>Status</th>
                <th style={th}>Department</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((asset) => (
                <tr key={asset.id} className="table-row">
                  <td style={td}>
                    <Link
                      href={`/assets/${encodeURIComponent(asset.asset_id)}`}
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#0070f3',
                        textDecoration: 'none',
                        fontSize: 13,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#00d4ff')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#0070f3')
                      }
                    >
                      {asset.asset_id}
                    </Link>
                  </td>
                  <td style={{ ...td, fontWeight: 600 }}>{asset.name}</td>
                  <td
                    style={{ ...td, color: 'var(--text-secondary)' }}
                  >
                    {getTypeLabel(asset.type)}
                  </td>
                  <td
                    style={{
                      ...td,
                      textAlign: 'right',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {formatCurrency(asset.price)}
                  </td>
                  <td style={td}>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td
                    style={{ ...td, color: 'var(--text-secondary)' }}
                  >
                    {asset.department || '—'}
                  </td>
                  <td
                    style={{ ...td, color: 'var(--text-muted)' }}
                  >
                    {formatDateShort(asset.created_at)}
                  </td>
                </tr>
              ))}

              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: 48,
                      color: 'var(--text-muted)',
                      fontSize: 13,
                    }}
                  >
                    No assets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}