import Papa from 'papaparse'
import { Asset } from '@/types'
import { formatCurrency, getConditionLabel, getTypeLabel } from './utils'

export function exportAssetsToCSV(assets: Asset[]): void {
  const data = assets.map((a) => ({
    'Asset ID': a.asset_id,
    'Serial Number': a.serial_number || '',
    Name: a.name,
    Type: getTypeLabel(a.type),
    Brand: a.brand,
    Model: a.model,
    Price: formatCurrency(a.price),
    Status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
    Condition: getConditionLabel(a.condition),
    'Purchased Date': a.purchased_date,
    'Assigned To': a.assigned_to || 'N/A',
    Department: a.department || 'N/A',
    'Previous User': a.previous_user || 'N/A',
    Mouse: a.has_mouse ? (a.mouse_serial || 'Yes') : 'No',
    Keyboard: a.has_keyboard ? (a.keyboard_serial || 'Yes') : 'No',
    Monitor: a.has_monitor ? (a.monitor_serial || 'Yes') : 'No',
  }))

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `assets_${new Date().toISOString().split('T')[0]}.csv`
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}