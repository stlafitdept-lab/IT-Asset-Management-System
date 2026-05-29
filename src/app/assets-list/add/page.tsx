'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import AssetForm from '@/components/AssetForm'
import QRCodeView from '@/components/QRCodeView'
import { AssetFormData } from '@/types'
import { generateQRCode } from '@/lib/qr'
import toast from 'react-hot-toast'
import {
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlinePlusCircle,
} from 'react-icons/hi2'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AddAssetPage() {
  const [loading, setLoading] = useState(false)
  const [createdAsset, setCreatedAsset] = useState<{
    asset_id: string
    qr_code_url: string
    name: string
  } | null>(null)

  const { isAdmin, isHR, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !isAdmin && !isHR) {
      toast.error('Access denied.')
      router.push('/assets-list')
    }
  }, [isAdmin, isHR, authLoading, router])

  const handleSubmit = async (data: AssetFormData) => {
    setLoading(true)
    try {
      const { data: assetIdResult, error: idError } = await supabase.rpc(
        'generate_asset_id',
        { p_type: data.type }
      )

      if (idError) {
        toast.error(`Failed: ${idError.message}`)
        return
      }

      const assetId = assetIdResult as string

      let qrUrl = ''
      try {
        const qrCodeDataUrl = await generateQRCode(assetId)
        try {
          const qrBlob = await fetch(qrCodeDataUrl).then((r) => r.blob())
          const { error: uploadError } = await supabase.storage
            .from('qr-codes')
            .upload(`${assetId}.png`, qrBlob, {
              contentType: 'image/png',
              upsert: true,
            })

          if (uploadError) {
            qrUrl = qrCodeDataUrl
          } else {
            const { data: publicUrl } = supabase.storage
              .from('qr-codes')
              .getPublicUrl(`${assetId}.png`)
            qrUrl = publicUrl.publicUrl
          }
        } catch {
          qrUrl = qrCodeDataUrl
        }
      } catch {
        qrUrl = ''
      }

      const { error: insertError } = await supabase.from('assets').insert({
        asset_id: assetId,
        name: data.name,
        type: data.type,
        brand: data.brand,
        model: data.model,
        serial_number: data.serial_number || null,
        price: data.price,
        status: data.status,
        condition: data.condition,
        purchased_date: data.purchased_date,
        assigned_to: data.assigned_to || null,
        department: data.department || null,
        previous_user: data.condition === 'old' ? data.previous_user : null,

        has_mouse: data.has_mouse,
        mouse_serial: data.has_mouse ? data.mouse_serial || null : null,
        has_keyboard: data.has_keyboard,
        keyboard_serial: data.has_keyboard ? data.keyboard_serial || null : null,
        has_monitor: data.has_monitor,
        monitor_serial: data.has_monitor ? data.monitor_serial || null : null,

        qr_code_url: qrUrl || null,
        created_by: profile?.id || null,
      })

      if (insertError) {
        toast.error(`Failed: ${insertError.message}`)
        return
      }

      try {
        await supabase.from('asset_history').insert({
          asset_id: assetId,
          action: 'created',
          changed_by: profile?.id || null,
        })
      } catch {}

      toast.success(`Asset ${assetId} created!`)
      setCreatedAsset({
        asset_id: assetId,
        qr_code_url: qrUrl,
        name: data.name,
      })
    } catch (error: any) {
      toast.error(error?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 240,
        }}
      >
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

  if (!isAdmin && !isHR) return null

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link
          href="/assets-list"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--glass-border)',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <HiOutlineArrowLeft
            style={{ width: 18, height: 18, color: 'var(--text-secondary)' }}
          />
        </Link>
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#0070f3',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 2,
            }}
          >
            Inventory
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>
            Add New Asset
          </h1>
        </div>
      </div>

      {createdAsset ? (
        <div className="glass" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <HiOutlineCheckCircle
                style={{ width: 28, height: 28, color: '#34d399' }}
              />
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 8px',
              }}
            >
              Asset Created!
            </h2>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              ID:{' '}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#0070f3',
                }}
              >
                {createdAsset.asset_id}
              </span>
            </p>

            {createdAsset.qr_code_url && (
              <div
                style={{
                  marginTop: 24,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <QRCodeView
                  qrCodeUrl={createdAsset.qr_code_url}
                  assetId={createdAsset.asset_id}
                  assetName={createdAsset.name}
                />
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <button
                onClick={() => setCreatedAsset(null)}
                className="btn-primary"
              >
                <HiOutlinePlusCircle size={14} />
                Add Another
              </button>
              <Link
                href="/assets-list"
                className="btn-ghost"
                style={{ textDecoration: 'none' }}
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            background:
              'linear-gradient(160deg, rgba(8,16,42,0.95), rgba(6,12,32,0.98))',
            backdropFilter: 'blur(10px) saturate(180%)',
            border: '1px solid rgba(40,80,160,0.25)',
            borderRadius: 16,
            padding: 24,
            boxShadow:
              '0 0 80px rgba(0,112,243,0.06), 0 32px 64px rgba(0,0,0,0.3)',
          }}
        >
          <AssetForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/assets-list')}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  )
}