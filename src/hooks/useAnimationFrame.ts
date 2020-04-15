import React from 'react'

const useAnimationFrame = (fn: () => void) => {
  const [f] = React.useState(() => fn)

  React.useEffect(() => {
    let stop = false
    const animate = () => {
      if (stop) return
      f()
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return () => { stop = true }
  }, [f])
}

export default useAnimationFrame