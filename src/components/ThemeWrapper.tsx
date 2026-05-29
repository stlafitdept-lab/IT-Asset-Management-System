'use client'
import { ThemeProvider } from './ThemeProvider'
import ToastProvider from './ToastProvider'

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}<ToastProvider /></ThemeProvider>
}