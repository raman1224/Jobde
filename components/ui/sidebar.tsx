// components/ui/sidebar.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{ isOpen: boolean; setIsOpen: (open: boolean) => void }>({
  isOpen: true,
  setIsOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarInset({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = React.useContext(SidebarContext)
  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300",
        isOpen ? "ml-64" : "ml-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function useSidebar() {
  return React.useContext(SidebarContext)
}