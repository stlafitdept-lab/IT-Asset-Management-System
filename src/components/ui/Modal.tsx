'use client'
import { useEffect } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  compact?: boolean
}

export default function Modal({ isOpen, onClose, title, subtitle, children, compact = false }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background: rgba(2, 5, 12, 0.6);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
        }

        .modal-container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 10;
          left: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .modal-container {
            padding: 16px;
            bottom: 16px;
          }
        }

        @media (max-width: 480px) {
          .modal-container {
            padding: 10px;
            bottom: 10px;
          }
        }

        .modal-card {
          pointer-events: auto;
          width: 100%;
          max-width: ${compact ? '400px' : '640px'};
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          background: rgba(8, 14, 30, 0.96);
          border: 1px solid rgba(0, 112, 243, 0.25);
          border-radius: 16px;
          box-shadow:
            0 0 0 1px rgba(0, 112, 243, 0.06),
            0 0 30px rgba(0, 112, 243, 0.1),
            0 0 60px rgba(0, 112, 243, 0.04),
            0 24px 64px rgba(0, 0, 0, 0.4);
          animation: fadeIn 0.2s ease-out;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .modal-card {
            max-width: 100%;
            max-height: 92vh;
            border-radius: 14px;
          }
        }

        @media (max-width: 480px) {
          .modal-card {
            max-height: 95vh;
            border-radius: 12px;
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0, 112, 243, 0.12);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 12px 16px;
          }
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }

        @media (max-width: 480px) {
          .modal-body {
            padding: 16px;
          }
        }

        .modal-body::-webkit-scrollbar {
          width: 4px;
        }
        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(0, 112, 243, 0.15);
          border-radius: 99px;
        }
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 112, 243, 0.25);
        }
      `}</style>

      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Container */}
      <div className="modal-container">
        <div className="modal-card" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontFamily: 'monospace' }}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,112,243,0.06)',
                border: '1px solid rgba(0,112,243,0.15)',
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,112,243,0.5)'
                e.currentTarget.style.background = 'rgba(0,112,243,0.12)'
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0,112,243,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,112,243,0.15)'
                e.currentTarget.style.background = 'rgba(0,112,243,0.06)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <HiOutlineXMark style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}