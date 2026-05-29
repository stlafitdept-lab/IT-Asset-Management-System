'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Replacement } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { formatDateShort } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import ReplacementForm from '@/components/ReplacementForm'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'
import {
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath,
} from 'react-icons/hi2'

export const dynamic = 'force-dynamic'
export default function ReplacementsPage() {
  const [records, setRecords] = useState<Replacement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<{
    open: boolean
    record: Replacement | null
  }>({ open: false, record: null })
  const [delModal, setDelModal] = useState<{
    open: boolean
    record: Replacement | null
  }>({ open: false, record: null })
  const [formLoading, setFormLoading] = useState(false)

  const { isAdmin, isHR, profile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('replacements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) toast.error('Failed to fetch records')
    else setRecords(data || [])

    setLoading(false)
  }

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      return (
        !q ||
        r.asset_id.toLowerCase().includes(q) ||
        r.part_name.toLowerCase().includes(q) ||
        (r.serial_number?.toLowerCase().includes(q) ?? false) ||
        (r.notes?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [records, search])

  async function handleAdd(data: any) {
    setFormLoading(true)
    try {
      const { error } = await supabase.from('replacements').insert({
        asset_id: data.asset_id,
        part_name: data.part_name,
        serial_number: data.serial_number || null,
        date_purchased: data.date_purchased || null,
        date_replaced: data.date_replaced,
        notes: data.notes || null,
        performed_by: profile?.id,
      })
      if (error) throw error
      toast.success('Replacement recorded')
      setAddModal(false)
      load()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleEdit(data: any) {
    if (!editModal.record) return
    setFormLoading(true)
    try {
      const { error } = await supabase
        .from('replacements')
        .update({
          part_name: data.part_name,
          serial_number: data.serial_number || null,
          date_purchased: data.date_purchased || null,
          date_replaced: data.date_replaced,
          notes: data.notes || null,
        })
        .eq('id', editModal.record.id)

      if (error) throw error

      toast.success('Record updated')
      setEditModal({ open: false, record: null })
      load()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
    if (!delModal.record) return
    try {
      const { error } = await supabase
        .from('replacements')
        .delete()
        .eq('id', delModal.record.id)

      if (error) throw error

      toast.success('Record deleted')
      setDelModal({ open: false, record: null })
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
            Hardware
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
            Replacements & Upgrades
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 4,
            }}
          >
            Track hardware replacements and upgrades
          </p>
        </div>

        {(isAdmin || isHR) && (
          <button onClick={() => setAddModal(true)} className="btn-primary">
            <HiOutlinePlusCircle size={15} />
            New Record
          </button>
        )}
      </div>

      {/* Search */}
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
            id="search-rep"
            name="search"
            type="text"
            placeholder="Search by asset, part, serial..."
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
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={card}>
          <EmptyState
            title="No records"
            description="No replacement or upgrade records found"
            icon={
              <HiOutlineArrowPath
                style={{ width: 24, height: 24, color: 'var(--text-muted)' }}
              />
            }
          />
        </div>
      ) : (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Asset</th>
                  <th style={th}>Part</th>
                  <th style={th}>Serial #</th>
                  <th style={th}>Purchased</th>
                  <th style={th}>Replaced</th>
                  <th style={th}>Notes</th>
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="table-row" style={{ transition: 'background 0.15s' }}>
                    <td style={td}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#0070f3',
                          fontSize: 13,
                        }}
                      >
                        {r.asset_id}
                      </span>
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: 'rgba(0,112,243,0.08)',
                          color: '#60a5fa',
                          border: '1px solid rgba(0,112,243,0.15)',
                        }}
                      >
                        {r.part_name}
                      </span>
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {r.serial_number || '—'}
                    </td>
                    <td style={{ ...td, color: 'var(--text-muted)' }}>
                      {r.date_purchased ? formatDateShort(r.date_purchased) : '—'}
                    </td>
                    <td style={{ ...td, color: 'var(--text-secondary)' }}>
                      {formatDateShort(r.date_replaced)}
                    </td>
                    <td
                      style={{
                        ...td,
                        color: 'var(--text-muted)',
                        maxWidth: 200,
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.notes || '—'}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                        {(isAdmin || isHR) && (
                          <button
                            onClick={() => setEditModal({ open: true, record: r })}
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
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => setDelModal({ open: true, record: r })}
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
        </div>
      )}

      {/* Add */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="New Replacement / Upgrade"
      >
        <ReplacementForm
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Edit */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, record: null })}
        title="Edit Record"
      >
        {editModal.record && (
          <ReplacementForm
            initialData={{
              asset_id: editModal.record.asset_id,
              part_name: editModal.record.part_name,
              serial_number: editModal.record.serial_number || '',
              date_purchased: editModal.record.date_purchased || '',
              date_replaced: editModal.record.date_replaced,
              notes: editModal.record.notes || '',
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditModal({ open: false, record: null })}
            isEdit
            isLoading={formLoading}
          />
        )}
      </Modal>

      {/* Delete */}
      <Modal
        isOpen={delModal.open}
        onClose={() => setDelModal({ open: false, record: null })}
        title="Delete Record"
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
            Delete Record?
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            This cannot be undone.
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
              onClick={() => setDelModal({ open: false, record: null })}
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