import { useEffect, useRef, useState } from 'react'

// True once the element has scrolled into the viewport (fires once, then
// disconnects). Resolves immediately for prefers-reduced-motion so nothing
// is gated behind a scroll a motion-sensitive user may never trigger.
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}
