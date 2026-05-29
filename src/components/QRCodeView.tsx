'use client'
import { HiOutlineArrowDownTray, HiOutlinePrinter } from 'react-icons/hi2'

interface Props { qrCodeUrl: string; assetId: string; assetName?: string }

export default function QRCodeView({ qrCodeUrl, assetId, assetName }: Props) {
  const download = () => {
    const a = document.createElement('a')
    a.href = qrCodeUrl
    a.download = `QR_${assetId}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const print = () => {
    const w = window.open('', '', 'width=400,height=500')
    if (w) {
      w.document.write(`<!DOCTYPE html><html><head><title>QR — ${assetId}</title><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;background:#fff}img{width:200px;height:200px}.id{font-size:14px;font-weight:700;margin-top:10px;font-family:monospace}.name{font-size:12px;color:#666;margin-top:4px}</style></head><body><img src="${qrCodeUrl}" alt="QR"/><div class="id">${assetId}</div>${assetName ? `<div class="name">${assetName}</div>` : ''}<script>window.onload=()=>{window.print();window.close()}</script></body></html>`)
      w.document.close()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <img
          src={qrCodeUrl}
          alt={`QR ${assetId}`}
          style={{ width: 160, height: 160, display: 'block' }}
        />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600, margin: 0 }}>
        {assetId}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={download} className="btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>
          <HiOutlineArrowDownTray size={14} /> Download
        </button>
        <button onClick={print} className="btn-ghost" style={{ padding: '8px 16px', fontSize: 12 }}>
          <HiOutlinePrinter size={14} /> Print
        </button>
      </div>
    </div>
  )
}