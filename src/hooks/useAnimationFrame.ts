import React from 'react'

const useAnimationFrame = (fn: () => void) => {
  React.useEffect(() => {
    let stop = false
    const animate = () => {
      if (stop) return
      fn()
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return () => { stop = true }
  }, [fn])
}

export default useAnimationFrame