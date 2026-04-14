import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration: number = 800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }

    const startTime = performance.now()
    const startValue = 0

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startValue + (target - startValue) * eased))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}