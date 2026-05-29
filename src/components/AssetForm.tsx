'use client'

import { useState } from 'react'
import { AssetFormData, AssetType, AssetStatus, AssetCondition } from '@/types'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'

const DEPARTMENTS = [
  'Marketing',
  'Litigation',
  'HR & Admin',
  'IT',
  'Accounting',
  'Corporate',
]

interface Props {
  initialData?: Partial<AssetFormData>
  onSubmit: (d: AssetFormData) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
  isLoading?: boolean
}

export default function AssetForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false,
}: Props) {
  const [fd, setFd] = useState<AssetFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'laptop',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    serial_number: initialData?.serial_number || '',
    price: initialData?.price || 0,
    status: initialData?.status || 'available',
    condition: initialData?.condition || 'brand_new',
    purchased_date:
      initialData?.purchased_date || new Date().toISOString().split('T')[0],
    assigned_to: initialData?.assigned_to || '',
    department: initialData?.department || '',
    previous_user: initialData?.previous_user || '',
    has_mouse: initialData?.has_mouse || false,
    mouse_serial: initialData?.mouse_serial || '',
    has_keyboard: initialData?.has_keyboard || false,
    keyboard_serial: initialData?.keyboard_serial || '',
    has_monitor: initialData?.has_monitor || false,
    monitor_serial: initialData?.monitor_serial || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const isOld = fd.condition === 'old'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!fd.name.trim()) e.name = 'Required'
    if (!fd.brand.trim()) e.brand = 'Required'
    if (!fd.model.trim()) e.model = 'Required'
    if (fd.price <= 0) e.price = 'Enter valid price'
    if (!fd.purchased_date) e.purchased_date = 'Required'
    if (isOld && !fd.previous_user.trim()) e.previous_user = 'Required'
    if (fd.status === 'assigned' && !fd.assigned_to.trim())
      e.assigned_to = 'Required'
    if (fd.has_mouse && !fd.mouse_serial.trim())
      e.mouse_serial = 'Serial number required'
    if (fd.has_keyboard && !fd.keyboard_serial.trim())
      e.keyboard_serial = 'Serial number required'
    if (fd.has_monitor && !fd.monitor_serial.trim())
      e.monitor_serial = 'Serial number required'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(fd)
  }

  const set = (f: keyof AssetFormData, v: string | number | boolean) => {
    setFd((p) => ({
      ...p,
      [f]: v,
      ...(f === 'condition' && v !== 'old' ? { previous_user: '' } : {}),
      ...(f === 'has_mouse' && !v ? { mouse_serial: '' } : {}),
      ...(f === 'has_keyboard' && !v ? { keyboard_serial: '' } : {}),
      ...(f === 'has_monitor' && !v ? { monitor_serial: '' } : {}),
    }))
    setErrors((p) => {
      const n = { ...p }
      delete n[f]
      return n
    })
  }

  const handlePriceKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ok = [
      '0','1','2','3','4','5','6','7','8','9','.',
      'Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End',
    ]
    if (!ok.includes(e.key)) {
      e.preventDefault()
      return
    }
    if (e.key === '.' && e.currentTarget.value.includes('.')) {
      e.preventDefault()
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = e.target.value
    if (r === '') {
      set('price', 0)
      return
    }
    if (/^\d*\.?\d{0,2}$/.test(r)) {
      set('price', parseFloat(r) || 0)
    }
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

  const onB = (e: React.FocusEvent<any>, f?: string) => {
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

  const checkboxStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    accentColor: '#0070f3',
    cursor: 'pointer',
    flexShrink: 0,
  }

  return (
    <form onSubmit={submit}>
      <style>{`
        .af2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .af3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
        @media(max-width:640px){.af2,.af3{grid-template-columns:1fr}}
        @media(min-width:641px) and (max-width:900px){.af3{grid-template-columns:1fr 1fr}}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Name */}
        <div>
          <Lbl id="af-name" t="Asset Name" r />
          <input
            id="af-name"
            name="name"
            type="text"
            value={fd.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g., Dell Latitude 5520"
            style={errors.name ? inpE : inp}
            onFocus={onF}
            onBlur={(e) => onB(e, 'name')}
            autoComplete="off"
          />
          <Err f="name" />
        </div>

        {/* Brand + Model */}
        <div className="af2">
          <div>
            <Lbl id="af-brand" t="Brand" r />
            <input
              id="af-brand"
              name="brand"
              type="text"
              value={fd.brand}
              onChange={(e) => set('brand', e.target.value)}
              placeholder="e.g., Dell"
              style={errors.brand ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onB(e, 'brand')}
              autoComplete="off"
            />
            <Err f="brand" />
          </div>
          <div>
            <Lbl id="af-model" t="Model" r />
            <input
              id="af-model"
              name="model"
              type="text"
              value={fd.model}
              onChange={(e) => set('model', e.target.value)}
              placeholder="e.g., Latitude 5520"
              style={errors.model ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onB(e, 'model')}
              autoComplete="off"
            />
            <Err f="model" />
          </div>
        </div>

        {/* Serial Number + Price */}
        <div className="af2">
          <div>
            <Lbl id="af-serial" t="Serial Number" r />
            <input
              id="af-serial"
              name="serial_number"
              type="text"
              value={fd.serial_number}
              onChange={(e) => set('serial_number', e.target.value)}
              placeholder="e.g., SN-12345678"
              style={inp}
              onFocus={onF}
              onBlur={(e) => onB(e)}
              autoComplete="off"
            />
          </div>
          <div>
            <Lbl id="af-price" t="Price (₱)" r />
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(100,150,220,0.5)',
                  fontSize: 13,
                  fontWeight: 700,
                  pointerEvents: 'none',
                }}
              >
                ₱
              </span>
              <input
                id="af-price"
                name="price"
                type="text"
                inputMode="decimal"
                value={fd.price || ''}
                onChange={handlePriceChange}
                onKeyDown={handlePriceKey}
                placeholder="0.00"
                style={{ ...(errors.price ? inpE : inp), paddingLeft: 22 }}
                onFocus={onF}
                onBlur={(e) => onB(e, 'price')}
                autoComplete="off"
              />
            </div>
            <Err f="price" />
          </div>
        </div>

        {/* Type + Condition + Status */}
        <div className="af3">
          <div>
            <Lbl id="af-type" t={isEdit ? 'Type (locked)' : 'Type'} />
            <select
              id="af-type"
              name="type"
              value={fd.type}
              onChange={(e) => set('type', e.target.value as AssetType)}
              disabled={isEdit}
              style={{
                ...inp,
                cursor: isEdit ? 'not-allowed' : 'pointer',
                opacity: isEdit ? 0.5 : 1,
              }}
              onFocus={onF}
              onBlur={(e) => onB(e)}
            >
              <option value="laptop">Laptop</option>
              <option value="mobile">Mobile</option>
              <option value="printer">Printer</option>
            </select>
          </div>

          <div>
            <Lbl id="af-cond" t="Condition" />
            <select
              id="af-cond"
              name="condition"
              value={fd.condition}
              onChange={(e) => set('condition', e.target.value as AssetCondition)}
              style={{ ...inp, cursor: 'pointer' }}
              onFocus={onF}
              onBlur={(e) => onB(e)}
            >
              <option value="brand_new">Brand New</option>
              <option value="refurbished">Refurbished</option>
              <option value="old">Old Laptop</option>
            </select>
          </div>

          <div>
            <Lbl id="af-status" t="Status" />
            <select
              id="af-status"
              name="status"
              value={fd.status}
              onChange={(e) => set('status', e.target.value as AssetStatus)}
              style={{ ...inp, cursor: 'pointer' }}
              onFocus={onF}
              onBlur={(e) => onB(e)}
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="repair">Under Repair</option>
            </select>
          </div>
        </div>

        {/* Previous User */}
        {isOld && (
          <div
            style={{
              padding: 12,
              background: 'var(--form-section-bg)',
              border: '1px solid var(--form-section-border)',
              borderRadius: 10,
            }}
          >
            <Lbl id="af-prev" t="Previous User" r />
            <input
              id="af-prev"
              name="previous_user"
              type="text"
              value={fd.previous_user}
              onChange={(e) => set('previous_user', e.target.value)}
              placeholder="Previous owner"
              style={errors.previous_user ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onB(e, 'previous_user')}
              autoComplete="off"
            />
            <Err f="previous_user" />
          </div>
        )}

        {/* Purchase Date */}
        <div>
          <Lbl id="af-date" t="Purchase Date" r />
          <input
            id="af-date"
            name="purchased_date"
            type="date"
            value={fd.purchased_date}
            onChange={(e) => set('purchased_date', e.target.value)}
            style={errors.purchased_date ? inpE : inp}
            onFocus={onF}
            onBlur={(e) => onB(e, 'purchased_date')}
          />
          <Err f="purchased_date" />
        </div>

        {/* Assigned To + Department */}
        <div className="af2">
          <div>
            <Lbl id="af-assigned" t={fd.status === 'assigned' ? 'Assigned To *' : 'Assigned To' } />
            <input
              id="af-assigned"
              name="assigned_to"
              type="text"
              value={fd.assigned_to}
              onChange={(e) => set('assigned_to', e.target.value)}
              placeholder="Employee name"
              style={errors.assigned_to ? inpE : inp}
              onFocus={onF}
              onBlur={(e) => onB(e, 'assigned_to')}
              autoComplete="off"
            />
            <Err f="assigned_to" />
          </div>
          <div>
            <Lbl id="af-dept" t="Department" r />
            <select
              id="af-dept"
              name="department"
              value={fd.department}
              onChange={(e) => set('department', e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}
              onFocus={onF}
              onBlur={(e) => onB(e)}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Peripherals */}
        <div
          style={{
            padding: 14,
            background: 'var(--form-section-bg)',
            border: '1px solid var(--form-section-border)',
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--form-label)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 12px',
            }}
          >
            Peripherals
          </p>

          {/* Mouse */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <input
              id="af-mouse"
              type="checkbox"
              checked={fd.has_mouse}
              onChange={(e) => {
                set('has_mouse', e.target.checked)
                if (!e.target.checked) set('mouse_serial', '')
              }}
              style={checkboxStyle}
            />
            <div style={{ flex: 1 }}>
              <label
                htmlFor="af-mouse"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: fd.has_mouse ? 6 : 0,
                }}
              >
                Mouse
              </label>
              {fd.has_mouse && (
                <>
                  <input
                    name="mouse_serial"
                    type="text"
                    value={fd.mouse_serial}
                    onChange={(e) => set('mouse_serial', e.target.value)}
                    placeholder="Serial number"
                    style={{
                      ...(errors.mouse_serial ? inpE : inp),
                      padding: '8px 10px',
                      fontSize: 12,
                    }}
                    onFocus={onF}
                    onBlur={(e) => onB(e, 'mouse_serial')}
                    autoComplete="off"
                  />
                  <Err f="mouse_serial" />
                </>
              )}
            </div>
          </div>

          {/* Keyboard */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <input
              id="af-keyboard"
              type="checkbox"
              checked={fd.has_keyboard}
              onChange={(e) => {
                set('has_keyboard', e.target.checked)
                if (!e.target.checked) set('keyboard_serial', '')
              }}
              style={checkboxStyle}
            />
            <div style={{ flex: 1 }}>
              <label
                htmlFor="af-keyboard"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: fd.has_keyboard ? 6 : 0,
                }}
              >
                Keyboard
              </label>
              {fd.has_keyboard && (
                <>
                  <input
                    name="keyboard_serial"
                    type="text"
                    value={fd.keyboard_serial}
                    onChange={(e) => set('keyboard_serial', e.target.value)}
                    placeholder="Serial number"
                    style={{
                      ...(errors.keyboard_serial ? inpE : inp),
                      padding: '8px 10px',
                      fontSize: 12,
                    }}
                    onFocus={onF}
                    onBlur={(e) => onB(e, 'keyboard_serial')}
                    autoComplete="off"
                  />
                  <Err f="keyboard_serial" />
                </>
              )}
            </div>
          </div>

          {/* Monitor */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input
              id="af-monitor"
              type="checkbox"
              checked={fd.has_monitor}
              onChange={(e) => {
                set('has_monitor', e.target.checked)
                if (!e.target.checked) set('monitor_serial', '')
              }}
              style={checkboxStyle}
            />
            <div style={{ flex: 1 }}>
              <label
                htmlFor="af-monitor"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: fd.has_monitor ? 6 : 0,
                }}
              >
                Monitor
              </label>
              {fd.has_monitor && (
                <>
                  <input
                    name="monitor_serial"
                    type="text"
                    value={fd.monitor_serial}
                    onChange={(e) => set('monitor_serial', e.target.value)}
                    placeholder="Serial number"
                    style={{
                      ...(errors.monitor_serial ? inpE : inp),
                      padding: '8px 10px',
                      fontSize: 12,
                    }}
                    onFocus={onF}
                    onBlur={(e) => onB(e, 'monitor_serial')}
                    autoComplete="off"
                  />
                  <Err f="monitor_serial" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
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
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
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
          {isEdit ? 'Save Changes' : 'Create Asset'}
        </button>
      </div>
    </form>
  )
}