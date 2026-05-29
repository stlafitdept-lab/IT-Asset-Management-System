export type UserRole = 'admin' | 'hr'
export type AssetType = 'laptop' | 'mobile' | 'printer'
export type AssetStatus = 'available' | 'assigned' | 'repair'
export type AssetCondition = 'brand_new' | 'refurbished' | 'old'
export type MaintenanceStatus = 'pending' | 'ongoing' | 'completed'

export interface Profile {
  id: string
  email: string
  role: UserRole
  full_name?: string
  created_at: string
}

export interface Asset {
  id: string
  asset_id: string
  name: string
  type: AssetType
  brand: string
  model: string
  serial_number: string | null
  price: number
  status: AssetStatus
  condition: AssetCondition
  purchased_date: string
  assigned_to: string | null
  department: string | null
  previous_user: string | null
  qr_code_url: string | null

  has_mouse: boolean
  mouse_serial: string | null
  has_keyboard: boolean
  keyboard_serial: string | null
  has_monitor: boolean
  monitor_serial: string | null

  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Replacement {
  id: string
  asset_id: string
  part_name: string
  serial_number: string | null
  date_purchased: string | null
  date_replaced: string
  notes: string | null
  performed_by: string | null
  created_at: string
}

export interface MaintenanceLog {
  id: string
  asset_id: string
  issue: string
  action_taken: string | null
  status: MaintenanceStatus
  date_reported: string
  date_resolved: string | null
  technician: string
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface AssetHistory {
  id: string
  asset_id: string
  action: string
  field_changed: string | null
  old_value: string | null
  new_value: string | null
  changed_by: string | null
  created_at: string
}

export interface AssetFormData {
  name: string
  type: AssetType
  brand: string
  model: string
  serial_number: string
  price: number
  status: AssetStatus
  condition: AssetCondition
  purchased_date: string
  assigned_to: string
  department: string
  previous_user: string

  has_mouse: boolean
  mouse_serial: string
  has_keyboard: boolean
  keyboard_serial: string
  has_monitor: boolean
  monitor_serial: string
}

export interface ReplacementFormData {
  asset_id: string
  part_name: string
  serial_number: string
  date_purchased: string
  date_replaced: string
  notes: string
}

export interface MaintenanceFormData {
  asset_id: string
  issue: string
  action_taken: string
  status: MaintenanceStatus
  date_reported: string
  date_resolved: string
  technician: string
}

export interface DashboardStats {
  total: number
  available: number
  assigned: number
  repair: number
  totalValue: number
  byType: {
    laptop: number
    mobile: number
    printer: number
  }
}