'use client'
import { useState, useEffect } from 'react'
import { MaintenanceFormData, MaintenanceStatus, Asset } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'

interface Props { initialData?: Partial<MaintenanceFormData>; onSubmit: (d: MaintenanceFormData) => Promise<void>; onCancel: () => void; isEdit?: boolean; isLoading?: boolean }

export default function MaintenanceForm({ initialData, onSubmit, onCancel, isEdit = false, isLoading = false }: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [fd, setFd] = useState<MaintenanceFormData>({ asset_id: initialData?.asset_id || '', issue: initialData?.issue || '', action_taken: initialData?.action_taken || '', status: initialData?.status || 'pending', date_reported: initialData?.date_reported || new Date().toISOString().split('T')[0], date_resolved: initialData?.date_resolved || '', technician: initialData?.technician || '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  useEffect(() => { async function load() { try { const supabase = createClient(); const { data } = await supabase.from('assets').select('asset_id,name,type').order('asset_id'); if (data) setAssets(data as Asset[]) } catch {} finally { setAssetsLoaded(true) } }; load() }, [])
  const validate = () => { const e: Record<string, string> = {}; if (!fd.asset_id) e.asset_id = 'Select asset'; if (!fd.issue.trim()) e.issue = 'Required'; if (!fd.technician.trim()) e.technician = 'Required'; if (!fd.date_reported) e.date_reported = 'Required'; if (fd.status === 'completed' && !fd.date_resolved) e.date_resolved = 'Required'; setErrors(e); return Object.keys(e).length === 0 }
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!validate()) return; await onSubmit(fd) }
  const set = (f: keyof MaintenanceFormData, v: string) => { setFd(p => ({ ...p, [f]: v })); setErrors(p => { const n = { ...p }; delete n[f]; return n }) }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'var(--form-input-bg)', border: '1px solid var(--form-input-border)', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', colorScheme: 'dark' }
  const inpE: React.CSSProperties = { ...inp, borderColor: 'var(--form-error-border)', background: 'var(--form-error-bg)' }
  const onF = (e: React.FocusEvent<any>) => { e.target.style.borderColor = 'var(--form-input-border-hover)'; e.target.style.boxShadow = '0 0 0 3px var(--form-input-focus-ring), 0 0 20px var(--form-input-focus-glow)'; e.target.style.background = 'rgba(12, 28, 68, 0.6)' }
  const onBl = (e: React.FocusEvent<any>, f?: string) => { e.target.style.borderColor = f && errors[f] ? 'var(--form-error-border)' : 'var(--form-input-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--form-input-bg)' }
  const Lbl = ({ id, t, r }: { id: string; t: string; r?: boolean }) => (<label htmlFor={id} style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--form-label)', marginBottom: 5, letterSpacing: '0.02em' }}>{t}{r && <span style={{ color: 'var(--form-required)', marginLeft: 3 }}>*</span>}</label>)
  const Err = ({ f }: { f: string }) => errors[f] ? (<div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4, color: 'var(--form-error)', fontSize: 11 }}><HiOutlineExclamationCircle style={{ width: 12, height: 12 }} />{errors[f]}</div>) : null

  if (!assetsLoaded) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div style={{ width: 20, height: 20, border: '2px solid rgba(0,112,243,0.3)', borderTopColor: '#0070f3', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /></div>

  return (
    <form onSubmit={submit}>
      <style>{`.mf2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:640px){.mf2{grid-template-columns:1fr}}`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><Lbl id="mf-asset" t="Asset" r /><select id="mf-asset" name="mf_asset_id" value={fd.asset_id} onChange={e => set('asset_id', e.target.value)} disabled={isEdit} style={{ ...(errors.asset_id ? inpE : inp), cursor: isEdit ? 'not-allowed' : 'pointer', opacity: isEdit ? 0.5 : 1 }} onFocus={onF} onBlur={e => onBl(e, 'asset_id')}><option value="">Select an asset...</option>{assets.map(a => <option key={a.asset_id} value={a.asset_id}>{a.asset_id} — {a.name}</option>)}</select><Err f="asset_id" /></div>
        <div className="mf2">
          <div><Lbl id="mf-status" t="Status" r /><select id="mf-status" name="mf_status" value={fd.status} onChange={e => set('status', e.target.value as MaintenanceStatus)} style={{ ...inp, cursor: 'pointer' }} onFocus={onF} onBlur={e => onBl(e)}><option value="pending">Pending</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></div>
          <div><Lbl id="mf-tech" t="Technician" r /><input id="mf-tech" name="mf_technician" type="text" value={fd.technician} onChange={e => set('technician', e.target.value)} placeholder="e.g., Mike Johnson" style={errors.technician ? inpE : inp} onFocus={onF} onBlur={e => onBl(e, 'technician')} /><Err f="technician" /></div>
        </div>
        <div><Lbl id="mf-issue" t="Issue Description" r /><textarea id="mf-issue" name="mf_issue" value={fd.issue} onChange={e => set('issue', e.target.value)} placeholder="Describe the problem..." rows={3} style={{ ...(errors.issue ? inpE : inp), resize: 'vertical', minHeight: 70 }} onFocus={onF} onBlur={e => onBl(e, 'issue')} /><Err f="issue" /></div>
        <div><Lbl id="mf-action" t="Action Taken" /><textarea id="mf-action" name="mf_action" value={fd.action_taken} onChange={e => set('action_taken', e.target.value)} placeholder="Describe repairs..." rows={2} style={{ ...inp, resize: 'vertical', minHeight: 50 }} onFocus={onF} onBlur={e => onBl(e)} /></div>
        <div className="mf2">
          <div><Lbl id="mf-dreported" t="Date Reported" r /><input id="mf-dreported" name="mf_date_reported" type="date" value={fd.date_reported} onChange={e => set('date_reported', e.target.value)} style={errors.date_reported ? inpE : inp} onFocus={onF} onBlur={e => onBl(e, 'date_reported')} /><Err f="date_reported" /></div>
          <div><Lbl id="mf-dresolved" t={fd.status === 'completed' ? 'Date Resolved *' : 'Date Resolved'} /><input id="mf-dresolved" name="mf_date_resolved" type="date" value={fd.date_resolved} onChange={e => set('date_resolved', e.target.value)} style={errors.date_resolved ? inpE : inp} onFocus={onF} onBlur={e => onBl(e, 'date_resolved')} /><Err f="date_resolved" /></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(40, 80, 160, 0.15)' }}>
        <button type="button" onClick={onCancel} disabled={isLoading} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">{isLoading && <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}{isEdit ? 'Update Record' : 'Add Record'}</button>
      </div>
    </form>
  )
}