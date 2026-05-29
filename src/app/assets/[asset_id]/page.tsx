import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency, getConditionLabel, getTypeLabel, formatDate } from '@/lib/utils'
import AssetDetailClient from './AssetDetailClient'

export const dynamic = 'force-dynamic'
export default async function AssetPublicPage({
  params,
}: {
  params: Promise<{ asset_id: string }>
}) {
  const resolvedParams = await params
  const decodedId = decodeURIComponent(resolvedParams.asset_id)
  const supabase = await createServerSupabaseClient()

  const { data: asset } = await supabase
    .from('assets')
    .select('*')
    .eq('asset_id', decodedId)
    .single()

  if (!asset) notFound()

  return <AssetDetailClient asset={asset} />
}