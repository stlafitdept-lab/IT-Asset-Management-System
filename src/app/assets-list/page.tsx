'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Asset, AssetType, AssetStatus } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, getStatusColor, getTypeLabel } from '@/lib/utils'
import { exportAssetsToCSV } from '@/lib/csv'
import Modal from '@/components/ui/Modal'
import AssetForm from '@/components/AssetForm'
import QRCodeView from '@/components/QRCodeView'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineQrCode,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlineCube,
  HiOutlineEye,
} from 'react-icons/hi2'
export const dynamic = 'force-dynamic'

export default function AssetsListPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<AssetType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all')
  const [editModal, setEditModal] = useState<{
    open: boolean
    asset: Asset | null
  }>({ open: false, asset: null })
  const [qrModal, setQrModal] = useState<{
    open: boolean
    asset: Asset | null
  }>({ open: false, asset: null })
  const [delModal, setDelModal] = useState<{
    open: boolean
    asset: Asset | null
  }>({ open: false, asset: null })
  const [editLoading, setEditLoading] = useState(false)

  const { isAdmin, isHR } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) toast.error('Failed to fetch assets')
    else setAssets(data || [])

    setLoading(false)
  }

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const q = search.toLowerCase()
      return (
        (!q ||
          a.asset_id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          (a.assigned_to?.toLowerCase().includes(q) ?? false) ||
          (a.department?.toLowerCase().includes(q) ?? false) ||
          (a.serial_number?.toLowerCase().includes(q) ?? false)) &&
        (filterType === 'all' || a.type === filterType) &&
        (filterStatus === 'all' || a.status === filterStatus)
      )
    })
  }, [assets, search, filterType, filterStatus])

  async function handleEdit(data: any) {
    if (!editModal.asset) return
    setEditLoading(true)

    try {
      const upd = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        serial_number: data.serial_number || null,
        price: data.price,
        status: data.status,
        condition: data.condition,
        purchased_date: data.purchased_date,
        assigned_to: data.assigned_to || null,
        department: data.department || null,
        previous_user: data.condition === 'old' ? data.previous_user : null,
        has_mouse: data.has_mouse,
        mouse_serial: data.has_mouse ? data.mouse_serial || null : null,
        has_keyboard: data.has_keyboard,
        keyboard_serial: data.has_keyboard ? data.keyboard_serial || null : null,
        has_monitor: data.has_monitor,
        monitor_serial: data.has_monitor ? data.monitor_serial || null : null,
      }

      const { error } = await supabase
        .from('assets')
        .update(upd)
        .eq('id', editModal.asset.id)

      if (error) throw error

      toast.success('Asset updated')
      setEditModal({ open: false, asset: null })
      load()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setEditLoading(false)
    }
  }

  async function handleDelete() {
    if (!delModal.asset) return
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', delModal.asset.id)

      if (error) throw error

      toast.success('Asset deleted')
      setDelModal({ open: false, asset: null })
      load()
    } catch (e: any) {
      toast.error(e.message)
    }
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
    whiteSpace: 'nowrap',
  }

  const td: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 13,
    borderBottom: '1px solid var(--table-border-light)',
    color: '#fff',
  }

  const filterInp: React.CSSProperties = {
    padding: '9px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--glass-border)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    colorScheme: 'dark',
  }

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid var(--glass-border)',
    borderRadius: 14,
    overflow: 'hidden',
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

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            Inventory
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
            Assets
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 4,
            }}
          >
            {filtered.length} of {assets.length} assets
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => exportAssetsToCSV(filtered)}
            className="btn-ghost"
          >
            <HiOutlineArrowDownTray size={14} />
            Export
          </button>

          {(isAdmin || isHR) && (
            <Link
              href="/assets-list/add"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <HiOutlinePlusCircle size={15} />
              Add Asset
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <HiOutlineMagnifyingGlass
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              width: 15,
              height: 15,
            }}
          />
          <input
            id="search-assets"
            name="search"
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...filterInp,
              width: '100%',
              paddingLeft: 34,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select
          id="filter-type"
          name="filter_type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          style={{ ...filterInp, cursor: 'pointer' }}
        >
          <option value="all">All Types</option>
          <option value="laptop">Laptop</option>
          <option value="mobile">Mobile</option>
          <option value="printer">Printer</option>
        </select>

        <select
          id="filter-status"
          name="filter_status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{ ...filterInp, cursor: 'pointer' }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="repair">Repair</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={card}>
          <EmptyState
            title="No assets found"
            description={
              assets.length === 0
                ? 'Add your first asset'
                : 'Try adjusting filters'
            }
            icon={
              <HiOutlineCube
                style={{
                  width: 24,
                  height: 24,
                  color: 'var(--text-muted)',
                }}
              />
            }
            action={
              (isAdmin || isHR) && assets.length === 0 ? (
                <Link
                  href="/assets-list/add"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <HiOutlinePlusCircle size={14} />
                  Add Asset
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Asset ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Type</th>
                  <th style={th}>Brand / Model</th>
                  <th style={th}>Serial #</th>
                  <th style={{ ...th, textAlign: 'right' }}>Price</th>
                  <th style={th}>Status</th>
                  <th style={th}>Assigned To</th>
                  <th style={th}>Department</th>
                  <th style={{ ...th, textAlign: 'center' }}>QR</th>
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => (
                  <tr key={asset.id} className="table-row" style={{ transition: 'background 0.15s' }}>
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
                    <td style={{ ...td, color: 'var(--text-secondary)' }}>
                      {getTypeLabel(asset.type)}
                    </td>
                    <td style={td}>
                      <p
                        style={{
                          color: '#fff',
                          fontWeight: 500,
                          margin: 0,
                          fontSize: 13,
                        }}
                      >
                        {asset.brand}
                      </p>
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          margin: 0,
                          fontSize: 11,
                        }}
                      >
                        {asset.model}
                      </p>
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {asset.serial_number || '—'}
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
                    <td style={{ ...td, color: 'var(--text-muted)' }}>
                      {asset.assigned_to || '—'}
                    </td>
                    <td style={{ ...td, color: 'var(--text-secondary)' }}>
                      {asset.department || '—'}
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      {asset.qr_code_url ? (
                        <button
                          onClick={() => setQrModal({ open: true, asset })}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 6,
                            borderRadius: 8,
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = '#0070f3')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'var(--text-muted)')
                          }
                        >
                          <HiOutlineQrCode size={17} />
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 3,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Link
                          href={`/assets/${encodeURIComponent(asset.asset_id)}`}
                          style={{
                            padding: 6,
                            borderRadius: 8,
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            textDecoration: 'none',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = '#00d4ff')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'var(--text-muted)')
                          }
                        >
                          <HiOutlineEye size={16} />
                        </Link>

                        <button
                          onClick={() => setEditModal({ open: true, asset })}
                          style={{
                            padding: 6,
                            borderRadius: 8,
                            color: '#0070f3',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              'rgba(0,112,243,0.1)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'none')
                          }
                        >
                          <HiOutlinePencilSquare size={16} />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => setDelModal({ open: true, asset })}
                            style={{
                              padding: 6,
                              borderRadius: 8,
                              color: 'var(--danger-light)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                'var(--danger-bg)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = 'none')
                            }
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: '10px 20px',
              borderTop: '1px solid var(--table-border-light)',
              background: 'var(--table-footer-bg)',
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              Showing{' '}
              <span style={{ color: '#0070f3', fontWeight: 700 }}>
                {filtered.length}
              </span>{' '}
              of{' '}
              <span style={{ color: '#0070f3', fontWeight: 700 }}>
                {assets.length}
              </span>{' '}
              assets
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, asset: null })}
        title="Edit Asset"
        subtitle={editModal.asset?.asset_id}
      >
        {editModal.asset && (
          <AssetForm
            initialData={{
              name: editModal.asset.name,
              type: editModal.asset.type,
              brand: editModal.asset.brand,
              model: editModal.asset.model,
              serial_number: editModal.asset.serial_number || '',
              price: editModal.asset.price,
              status: editModal.asset.status,
              condition: editModal.asset.condition,
              purchased_date: editModal.asset.purchased_date,
              assigned_to: editModal.asset.assigned_to || '',
              department: editModal.asset.department || '',
              previous_user: editModal.asset.previous_user || '',
              has_mouse: editModal.asset.has_mouse || false,
              mouse_serial: editModal.asset.mouse_serial || '',
              has_keyboard: editModal.asset.has_keyboard || false,
              keyboard_serial: editModal.asset.keyboard_serial || '',
              has_monitor: editModal.asset.has_monitor || false,
              monitor_serial: editModal.asset.monitor_serial || '',
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditModal({ open: false, asset: null })}
            isEdit
            isLoading={editLoading}
          />
        )}
      </Modal>

      {/* QR Modal */}
      <Modal
        isOpen={qrModal.open}
        onClose={() => setQrModal({ open: false, asset: null })}
        title="QR Code"
        subtitle={qrModal.asset?.name}
        compact
      >
        {qrModal.asset?.qr_code_url && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 0',
            }}
          >
            <QRCodeView
              qrCodeUrl={qrModal.asset.qr_code_url}
              assetId={qrModal.asset.asset_id}
              assetName={qrModal.asset.name}
            />
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={delModal.open}
        onClose={() => setDelModal({ open: false, asset: null })}
        title="Delete Asset"
        compact
      >
        <div style={{ textAlign: 'center', padding: '4px 0' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <HiOutlineTrash
              style={{ width: 20, height: 20, color: 'var(--danger-light)' }}
            />
          </div>

          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 6px',
            }}
          >
            Are you sure?
          </h3>

          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            Delete{' '}
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0070f3',
              }}
            >
              {delModal.asset?.asset_id}
            </span>
            ?
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 16,
            }}
          >
            <button
              onClick={() => setDelModal({ open: false, asset: null })}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}