// src/components/ToastProvider.tsx
'use client'
import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <>
      <style>{`
        /* Toast container positioning */
        .toast-container > div {
          animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards !important;
        }

        /* Toast exit animation */
        .toast-container > div[style*="opacity: 0"] {
          animation: toastSlideOut 0.25s ease-in forwards !important;
        }
      `}</style>

      <Toaster
        position="top-center"
        containerClassName="toast-container"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(8, 14, 30, 0.96)',
            color: '#fff',
            border: '1px solid rgba(0, 112, 243, 0.2)',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: '14px 20px',
            maxWidth: '420px',
            boxShadow:
              '0 0 24px rgba(0, 112, 243, 0.08), 0 12px 40px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            gap: '10px',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#0a1228',
            },
            style: {
              borderColor: 'rgba(52, 211, 153, 0.25)',
              boxShadow:
                '0 0 24px rgba(52, 211, 153, 0.06), 0 12px 40px rgba(0, 0, 0, 0.4)',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0a1228',
            },
            style: {
              borderColor: 'rgba(248, 113, 113, 0.25)',
              boxShadow:
                '0 0 24px rgba(248, 113, 113, 0.06), 0 12px 40px rgba(0, 0, 0, 0.4)',
            },
          },
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
    </>
  )
}