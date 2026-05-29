'use client'

import { useState, useEffect } from 'react'
import { ReplacementFormData, Asset } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'

const PARTS = [
  'RAM',
  'SSD/HDD',
  'Battery',
  'Screen/LCD',
  'Keyboard',
  'Mouse',
  'Charger',
  'Motherboard',
  'Power Supply',
  'Toner/Ink',
  'Cartridge',
  'Monitor',
  'Cable',
  'Other',
]

interface Props {
  initialData?: Partial<ReplacementFormData>
  onSubmit: (d: ReplacementFormData) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
  isLoading?: boolean
}

export default function ReplacementForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false,
}: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [fd, setFd] = useState<ReplacementFormData>({
    asset_id: initialData?.asset_id || '',
    part_name: initialData?.part_name || '',
    serial_number: initialData?.serial_number || '',
    date_purchased: initialData?.date_purchased || '',
    date_replaced:
      initialData?.date_replaced || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('assets')
          .select('asset_id,name,type')
          .order('asset_id')
        if (data) setAssets(data as Asset[])
      } catch {
      } finally {
        setAssetsLoaded(true)
      }
    }
    load()
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fd.asset_id) e.asset_id = 'Select an asset'
    if (!fd.part_name.trim()) e.part_name = 'Select a part'
    if (!fd.serial_number.trim()) e.serial_number = 'Serial number required'
    if (!fd.date_purchased) e.date_purchased = 'Date purchased required'
    if (!fd.date_replaced) e.date_replaced = 'Date replaced required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(fd)
  }

  const set = (f: keyof ReplacementFormData, v: string) => {
    setFd((p) => ({ ...p, [f]: v }))
    setErrors((p) => {
      const n = { ...p }
      delete n[f]
      return n
    })
  }

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--form-input-bg)',
    border: '1px solid var(--form-input-border)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    colorScheme: 'dark',
  }

  const inpE: React.CSSProperties = {
    ...inp,
    borderColor: 'var(--form-error-border)',
    background: 'var(--form-error-bg)',
  }

  const onF = (e: React.FocusEvent<any>) => {
    e.target.style.borderColor = 'var(--form-input-border-hover)'
    e.target.style.boxShadow =
      '0 0 0 3px var(--form-input-focus-ring), 0 0 20px var(--form-input-focus-glow)'
    e.target.style.background = 'rgba(12, 28, 68, 0.6)'
  }

  const onBl = (e: React.FocusEvent<any>, f?: string) => {
    e.target.style.borderColor =
      f && errors[f] ? 'var(--form-error-border)' : 'var(--form-input-border)'
    e.target.style.boxShadow = 'none'
    e.target.style.background = 'var(--form-input-bg)'
  }

  const Lbl = ({
    id,
    t,
    r,
  }: {
    id: string
    t: string
    r?: boolean
  }) => (
    <label
      htmlFor={id}
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--form-label)',
        marginBottom: 5,
        letterSpacing: '0.02em',
      }}
    >
      {t}
      {r && <span style={{ color: 'var(--form-required)', marginLeft: 3 }}>*</span>}
    </label>
  )

  const Err = ({ f }: { f: string }) =>
    errors[f] ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          marginTop: 4,
          color: 'var(--form-error)',
          fontSize: 11,
        }}
      >
        <HiOutlineExclamationCircle style={{ width: 12, height: 12 }} />
        {errors[f]}
      </div>
    ) : null

  if (!assetsLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
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
    <form onSubmit={submit}>
      <style>{`
        .rf2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        @media(max-width:640px){.rf2{grid-template-columns:1fr}}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Lbl id="rf-asset" t="Issued To (Asset)" r />
          <select
            id="rf-asset"
            name="asset_id"
            value={fd.asset_id}
            onChange={(e) => set('asset_id', e.target.value)}
            disabled={isEdit}
            style={{
              ...(errors.asset_id ? inpE : inp),
              cursor: isEdit ? 'not-allowed' : 'pointer',
              opacity: isEdit ? 0.5 : 1,
            }}
            onFocus={onF}
            onBlur={(e) => onBl(e, 'asset_id')}
          >
            <option value="">Select an asset...</option>
            {assets.map((a) => (
              <option key={a.asset_id} value={a.asset_id}>
                {a.asset_id} — {a.name}
              </option>
            ))}
          </select>
          <Err f="asset_id" />
        </div>

        <div className="rf2">
          <div>
            <Lbl id="rf-part" t="Part / Component" r />
            <select
              id="rf-part"
              name="part_name"
              value={fd.part_name}
              onChange={(e) => set('part_name', e.target.value)}
              style={{
                ...(errors.part_name ? inpE : inp),
                cursor: 'pointer',
              }}
              onFocus={onF}
              onBlur={(e) => onBl(e, 'part_name')}
            >
              <option value="">Select part...</option>
              {PARTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Err f="part_name" />
          </div>

          <div>
            <Lbl id="rf-serial" t="Serial Number" r />
            <input
              id="rf-serial"
              name="serial_number"
              type="text"
              value={fd.serial_number}
              onChange={(e) => set('serial_number', e.target.value)}
              placeholder="New part serial number"
              style={errors.serial_number ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onBl(e, 'serial_number')}
              autoComplete="off"
            />
            <Err f="serial_number" />
          </div>
        </div>

        <div className="rf2">
          <div>
            <Lbl id="rf-date-purchased" t="Date Purchased" r />
            <input
              id="rf-date-purchased"
              name="date_purchased"
              type="date"
              value={fd.date_purchased}
              onChange={(e) => set('date_purchased', e.target.value)}
              style={errors.date_purchased ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onBl(e, 'date_purchased')}
            />
            <Err f="date_purchased" />
          </div>

          <div>
            <Lbl id="rf-date-replaced" t="Date of Replacement" r />
            <input
              id="rf-date-replaced"
              name="date_replaced"
              type="date"
              value={fd.date_replaced}
              onChange={(e) => set('date_replaced', e.target.value)}
              style={errors.date_replaced ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onBl(e, 'date_replaced')}
            />
            <Err f="date_replaced" />
          </div>
        </div>

        <div>
          <Lbl id="rf-notes" t="Notes" />
          <textarea
            id="rf-notes"
            name="notes"
            value={fd.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Reason for replacement, old part condition..."
            rows={3}
            style={{ ...inp, resize: 'vertical', minHeight: 60 }}
            onFocus={onF}
            onBlur={(e) => onBl(e)}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(40, 80, 160, 0.15)',
        }}
      >
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading && (
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
            />
          )}
          {isEdit ? 'Update Record' : 'Add Record'}
        </button>
      </div>
    </form>
  )
}