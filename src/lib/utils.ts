import { AssetType } from '@/types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'available': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
    case 'assigned':  return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
    case 'repair':    return 'bg-red-500/15 text-red-400 border border-red-500/20'
    case 'pending':   return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
    case 'ongoing':   return 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
    case 'completed': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
    default:          return 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
  }
}

export function getConditionLabel(c: string): string {
  switch (c) {
    case 'brand_new':   return 'Brand New'
    case 'refurbished': return 'Refurbished'
    case 'old':         return 'Old Laptop'
    default:            return c
  }
}

export function getTypeLabel(t: AssetType): string {
  switch (t) {
    case 'laptop':  return 'Laptop'
    case 'mobile':  return 'Mobile'
    case 'printer': return 'Printer'
    default:        return t
  }
}

export function cn(...c: (string | boolean | undefined | null)[]): string {
  return c.filter(Boolean).join(' ')
}