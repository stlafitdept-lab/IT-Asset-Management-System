'use client'

import { useEffect, useState } from 'react'

export default function ClientYear() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  if (year === null) return null

  return <>{year}</>
}