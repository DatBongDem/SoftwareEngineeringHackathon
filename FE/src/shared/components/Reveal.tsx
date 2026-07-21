import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'
import { cn } from '../lib/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger this instance behind others in the same list/grid. */
  delayMs?: number
}

// Fades/slides content up once it scrolls into view (see useInView) using the
// slide-in-from-bottom keyframe already defined in index.css. Use sparingly —
// hero/section-level reveals and staggered grids, not every single row.
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const style: CSSProperties | undefined = inView && delayMs ? { animationDelay: `${delayMs}ms` } : undefined

  return (
    <div ref={ref} className={cn(inView ? 'slide-in-from-bottom' : 'opacity-0', className)} style={style}>
      {children}
    </div>
  )
}
