import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DrawerContextType {
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

interface DrawerProviderProps {
  children: ReactNode
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

  return (
    <DrawerContext.Provider value={{
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer
    }}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext)
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}
