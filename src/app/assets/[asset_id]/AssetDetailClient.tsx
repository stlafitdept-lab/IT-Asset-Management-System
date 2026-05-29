'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChevronDown,
  HiOutlineArrowDownTray,
  HiOutlinePrinter,
} from 'react-icons/hi2'
import {
  formatCurrency,
  getConditionLabel,
  getTypeLabel,
  formatDate,
  formatDateShort,
} from '@/lib/utils'
import { Asset, Replacement } from '@/types'
import { createClient } from '@/lib/supabase/client'
import ClientYear from '@/components/ClientYear'

export default function AssetDetailClient({ asset }: { asset: Asset }) {
  const router = useRouter()
  const [replacements, setReplacements] = useState<Replacement[]>([])
  const [assetOpen, setAssetOpen] = useState(false)
  const [replOpen, setReplOpen] = useState(false)

  useEffect(() => {
    async function loadReplacements() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('replacements')
          .select('*')
          .eq('asset_id', asset.asset_id)
          .order('date_replaced', { ascending: false })
        if (data) setReplacements(data)
      } catch {}
    }
    loadReplacements()
  }, [asset.asset_id])

  const sc: Record<string, { label: string; color: string; bg: string }> = {
    available: { label: 'Available', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    assigned: { label: 'Assigned', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    repair: { label: 'Under Repair', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  }
  const status = sc[asset.status] || sc.available

  const cardBase: React.CSSProperties = {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid var(--glass-border)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  }

  const th: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    width: '40%',
    verticalAlign: 'top',
  }

  const tdS: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    verticalAlign: 'top',
  }

  const rb: React.CSSProperties = {
    borderBottom: '1px solid var(--border)',
  }

  const accordionHeader = (
    title: string,
    isOpen: boolean,
    toggle: () => void,
    count?: number
  ) => (
    <button
      onClick={toggle}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'rgba(0,112,243,0.02)',
        border: 'none',
        borderBottom: isOpen ? '1px solid var(--border)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#0070f3',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
          }}
        >
          {title}
        </p>
        {count !== undefined && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 700,
              background: 'rgba(0,112,243,0.1)',
              color: '#0070f3',
              border: '1px solid rgba(0,112,243,0.15)',
            }}
          >
            {count}
          </span>
        )}
      </div>
      <HiOutlineChevronDown
        style={{
          width: 16,
          height: 16,
          color: 'var(--text-muted)',
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </button>
  )

  const PeripheralRow = ({
    label,
    has,
    serial,
  }: {
    label: string
    has: boolean
    serial: string | null
  }) => {
    if (!has) return null
    return (
      <tr style={rb}>
        <td style={th}>{label}</td>
        <td style={{ ...tdS, fontFamily: 'monospace', fontSize: 12 }}>
          {serial || '—'}
        </td>
      </tr>
    )
  }

  // Label SVG builder
  const escapeXml = (value?: string | null) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const fetchQrAsDataUrl = async (src: string) => {
    if (!src) return ''
    if (src.startsWith('data:')) return src
    const res = await fetch(src)
    const blob = await res.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const buildLabelSvg = (qrSrc: string) => {
    const assetId = escapeXml(asset.asset_id)
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect x="1" y="1" width="1198" height="598" fill="#ffffff" stroke="#111111" stroke-width="2"/>
  <line x1="780" y1="40" x2="780" y2="560" stroke="#111111" stroke-width="2"/>
  <text x="56" y="78" fill="#111111" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" letter-spacing="3">PROPERTY OF:</text>
  <text x="390" y="260" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="150" font-weight="800" letter-spacing="2"><tspan fill="#123765">ST</tspan><tspan fill="#CCAA49">LAF</tspan></text>
  <line x1="86" y1="348" x2="694" y2="348" stroke="#111111" stroke-width="2"/>
  <text x="390" y="392" text-anchor="middle" fill="#111111" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="1.5" textLength="560" lengthAdjust="spacingAndGlyphs">SADSAD TAMESIS LEGAL AND ACCOUNTANCY FIRM</text>
  <text x="990" y="84" text-anchor="middle" fill="#111111" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" letter-spacing="3">SCAN ME!</text>
  ${qrSrc ? `<image href="${escapeXml(qrSrc)}" x="870" y="138" width="240" height="240" preserveAspectRatio="xMidYMid meet"/>` : ''}
  <text x="990" y="452" text-anchor="middle" fill="#111111" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="1.5">${assetId}</text>
</svg>`.trim()
  }

  const handlePrint = async () => {
    try {
      const qrData = await fetchQrAsDataUrl(asset.qr_code_url || '')
      const svg = buildLabelSvg(qrData)
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
      const w = window.open('', '', 'width=900,height=500')
      if (!w) return
      w.document.write(`<!DOCTYPE html><html><head><title>Label — ${asset.asset_id}</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f3f4f6}.wrap{width:3in}img{width:100%;height:auto;display:block}@page{size:auto;margin:0.2in}</style></head><body><div class="wrap"><img src="${dataUrl}" alt="Label"/></div><script>window.onload=()=>{window.print();window.close()}</script></body></html>`)
      w.document.close()
    } catch (err) { console.error('Print failed:', err) }
  }

  const handleDownload = async () => {
    try {
      const qrData = await fetchQrAsDataUrl(asset.qr_code_url || '')
      const svg = buildLabelSvg(qrData)
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 1200; canvas.height = 600
        const ctx = canvas.getContext('2d')
        if (!ctx) { URL.revokeObjectURL(svgUrl); return }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(svgUrl)
        canvas.toBlob((blob) => {
          if (!blob) return
          const pngUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = pngUrl; a.download = `${asset.asset_id}_label.png`
          document.body.appendChild(a); a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(pngUrl)
        }, 'image/png')
      }
      img.onerror = () => { URL.revokeObjectURL(svgUrl) }
      img.src = svgUrl
    } catch (err) { console.error('Download failed:', err) }
  }

  return (
    <>
      <style>{`
        .asset-bg{min-height:100vh;background:var(--bg);position:relative;overflow-x:hidden}
        .asset-bg::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 25% 20%,rgba(0,112,243,0.07) 0%,transparent 55%),radial-gradient(ellipse at 75% 80%,rgba(0,112,243,0.05) 0%,transparent 55%);pointer-events:none;z-index:0}
        .asset-content{position:relative;z-index:1;max-width:600px;margin:0 auto;padding:24px 16px}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <div className="asset-bg">
        <div className="asset-content">

          {/* Close + Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: status.bg, border: `1px solid ${status.color}30` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: status.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{status.label}</span>
            </div>
            <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,112,243,0.5)'; e.currentTarget.style.background = 'rgba(0,112,243,0.08)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,112,243,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none' }}>
              <HiOutlineXMark style={{ width: 18, height: 18, color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{asset.name}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', margin: 0 }}>{asset.asset_id}</p>
          </div>

          {/* Accordion 1: Asset Information */}
          <div style={cardBase}>
            {accordionHeader('Asset Information', assetOpen, () => setAssetOpen(!assetOpen))}

            {assetOpen && (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={rb}><td style={th}>Asset ID</td><td style={{ ...tdS, color: '#0070f3', fontFamily: 'monospace' }}>{asset.asset_id}</td></tr>
                    {asset.serial_number && <tr style={rb}><td style={th}>Serial Number</td><td style={{ ...tdS, fontFamily: 'monospace' }}>{asset.serial_number}</td></tr>}
                    <tr style={rb}><td style={th}>Name</td><td style={tdS}>{asset.name}</td></tr>
                    <tr style={rb}><td style={th}>Type</td><td style={tdS}>{getTypeLabel(asset.type)}</td></tr>
                    <tr style={rb}><td style={th}>Brand</td><td style={tdS}>{asset.brand}</td></tr>
                    <tr style={rb}><td style={th}>Model</td><td style={tdS}>{asset.model}</td></tr>
                    <tr style={rb}><td style={th}>Price</td><td style={{ ...tdS, color: '#0070f3' }}>{formatCurrency(asset.price)}</td></tr>
                    <tr style={rb}><td style={th}>Condition</td><td style={tdS}>{getConditionLabel(asset.condition)}</td></tr>
                    <tr style={rb}><td style={th}>Purchased</td><td style={tdS}>{formatDate(asset.purchased_date)}</td></tr>
                    {asset.assigned_to && <tr style={rb}><td style={th}>Assigned To</td><td style={tdS}>{asset.assigned_to}</td></tr>}
                    {asset.department && <tr style={rb}><td style={th}>Department</td><td style={tdS}>{asset.department}</td></tr>}
                    {asset.previous_user && <tr style={rb}><td style={th}>Previous User</td><td style={tdS}>{asset.previous_user}</td></tr>}
                  </tbody>
                </table>

                {/* Peripherals */}
                {(asset.has_mouse || asset.has_keyboard || asset.has_monitor) ? (
                  <>
                    <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(0,112,243,0.08)', borderBottom: '1px solid var(--border)', background: 'rgba(0,112,243,0.01)' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Peripherals</p>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <PeripheralRow label="Mouse" has={asset.has_mouse} serial={asset.mouse_serial} />
                        <PeripheralRow label="Keyboard" has={asset.has_keyboard} serial={asset.keyboard_serial} />
                        <PeripheralRow label="Monitor" has={asset.has_monitor} serial={asset.monitor_serial} />
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(0,112,243,0.08)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Peripherals</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>None</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Accordion 2: Replacement History */}
          <div style={cardBase}>
            {accordionHeader('Replacement / Upgrade History', replOpen, () => setReplOpen(!replOpen), replacements.length)}

            {replOpen && (
              <>
                {replacements.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '10px 16px', fontSize: 10, fontWeight: 800, color: '#fff', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Part</th>
                        <th style={{ padding: '10px 16px', fontSize: 10, fontWeight: 800, color: '#fff', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Serial #</th>
                        <th style={{ padding: '10px 16px', fontSize: 10, fontWeight: 800, color: '#fff', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Purchased</th>
                        <th style={{ padding: '10px 16px', fontSize: 10, fontWeight: 800, color: '#fff', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>Replaced</th>
                      </tr>
                    </thead>
                    <tbody>
                      {replacements.map(r => (
                        <tr key={r.id} style={rb}>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: '#fff' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(0,112,243,0.08)', color: '#60a5fa', border: '1px solid rgba(0,112,243,0.15)' }}>
                              {r.part_name}
                            </span>
                          </td>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {r.serial_number || '—'}
                          </td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                            {r.date_purchased ? formatDateShort(r.date_purchased) : '—'}
                          </td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {formatDateShort(r.date_replaced)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No replacement or upgrade records</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Label Preview */}
          <div style={{ width: '100%', maxWidth: 240, margin: '0 auto 12px', aspectRatio: '2 / 1', background: '#ffffff', border: '1px solid #111111', display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px 7px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ width: '100%', textAlign: 'left', fontSize: 4.8, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111' }}>Property Of:</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 800, lineHeight: 1, letterSpacing: '0.02em' }}>
                <span style={{ color: '#123765' }}>ST</span><span style={{ color: '#CCAA49' }}>LAF</span>
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ width: '100%', height: 0.5, background: '#111111', marginBottom: 2 }} />
                <div style={{ fontSize: 3.2, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#111111', whiteSpace: 'nowrap', transform: 'scaleX(0.86)', transformOrigin: 'center' }}>SADSAD TAMESIS LEGAL AND ACCOUNTANCY FIRM</div>
              </div>
            </div>
            <div style={{ width: 1, background: '#111111', margin: '6px 0' }} />
            <div style={{ width: '36%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '8px 6px 7px', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ fontSize: 4.8, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111' }}>Scan Me!</div>
              {asset.qr_code_url ? <img src={asset.qr_code_url} alt="QR" style={{ width: 42, height: 42, imageRendering: 'pixelated' as const }} /> : <div style={{ width: 42, height: 42, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#999' }}>No QR</div>}
              <div style={{ fontSize: 4.2, fontWeight: 700, fontFamily: "'Inter', monospace", color: '#111111', letterSpacing: '0.04em', wordBreak: 'break-word' }}>{asset.asset_id}</div>
            </div>
          </div>

          {/* Actions */}
          {asset.qr_code_url && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <button onClick={handleDownload} className="btn-ghost" style={{ padding: '10px 18px', fontSize: 12 }}>
                <HiOutlineArrowDownTray size={14} /> Download Label
              </button>
              <button onClick={handlePrint} className="btn-primary" style={{ padding: '10px 18px', fontSize: 12 }}>
                <HiOutlinePrinter size={14} /> Print Label
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text-dim)' }}>
            IT Asset Management © <ClientYear />
          </p>
        </div>
      </div>
    </>
  )
}