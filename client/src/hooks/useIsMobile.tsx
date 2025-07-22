import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const hoverMql = window.matchMedia('(hover: hover) and (pointer: fine)')
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || !hoverMql.matches)
    }
    
    mql.addEventListener("change", onChange)
    hoverMql.addEventListener("change", onChange)
    
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || !hoverMql.matches)
    
    return () => {
      mql.removeEventListener("change", onChange)
      hoverMql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
