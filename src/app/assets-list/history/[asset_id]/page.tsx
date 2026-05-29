'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AssetHistory } from '@/types'
import { formatDate } from '@/lib/utils'
import DashboardLayout from '@/components/DashboardLayout'

export default function AssetHistoryPage() {
  const params = useParams()
  const assetId = decodeURIComponent(params.asset_id as string)
  const [history, setHistory] = useState<AssetHistory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('asset_history')
        .select('*')
        .eq('asset_id', assetId)
        .order('created_at', { ascending: false })

      setHistory(data || [])
      setLoading(false)
    }
    fetchHistory()
  }, [assetId, supabase])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Asset History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
            {assetId}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No history records found
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {entry.action}
                    </p>
                    {entry.field_changed && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-medium">{entry.field_changed}:</span>{' '}
                        <span className="text-red-500 line-through">{entry.old_value}</span>
                        {' → '}
                        <span className="text-green-600">{entry.new_value}</span>
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(entry.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}