'use client'

import React, { createContext, useContext } from 'react'

const ThemeContext = createContext({ theme: 'dark' as const })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'dark' }}>{children}</ThemeContext.Provider>
}

export function useTheme() { return useContext(ThemeContext) }
export default ThemeProvider