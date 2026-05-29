'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowRight } from 'react-icons/hi2'
import ClientYear from '@/components/ClientYear'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter your credentials'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) { toast.error(error.message); setLoading(false); return }
      if (data.session) {
        toast.success('Welcome back!')
        setTimeout(() => { window.location.href = '/dashboard' }, 400)
      }
    } catch (err: any) {
      toast.error(err.message || 'Unexpected error')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#080a14',
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/login-bg.jpg" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.15 }} priority quality={80} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,8,18,0.98) 0%, rgba(10,12,30,0.95) 40%, rgba(15,17,35,0.92) 100%)' }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, padding: '20px' }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', marginBottom: 20, position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              priority
              style={{ objectFit: 'contain', width: 80, height: 80, position: 'relative' }}
            />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            IT Asset Management
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Track, manage, and optimize the lifecycle of hardware assets.
          </p>
        </div>

        {/* Login Card — emphasized */}
        <div style={{
          background: 'linear-gradient(160deg, rgba(22,27,46,0.95) 0%, rgba(17,21,36,0.98) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 24,
          padding: '36px 32px 32px',
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 0 0 1px rgba(99,102,241,0.08),
            0 0 40px rgba(99,102,241,0.08),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
            background: 'linear-gradient(90deg, transparent, #6366f1, #3b82f6, transparent)',
            borderRadius: '0 0 4px 4px',
          }} />

          {/* Card inner glow */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                Log In
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" autoFocus required autoComplete="email"
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(6,8,20,0.8)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif",
                    transition: 'all 0.2s', colorScheme: 'dark',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    name="password"
                    type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required autoComplete="current-password"
                    style={{
                      width: '100%', padding: '12px 48px 12px 16px',
                      background: 'rgba(6,8,20,0.8)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none',
                      boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif",
                      transition: 'all 0.2s', colorScheme: 'dark',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.06)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.2)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', padding: 4, display: 'flex', transition: 'color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                  >
                    {showPass ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading || !email || !password}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 15, marginTop: 4, borderRadius: 12 }}
              >
                {loading ? (
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <>Log In <HiOutlineArrowRight size={17} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.50)' }}>
          IT & Innovations Department © <ClientYear />
        </p>
      </div>
    </div>
  )
}