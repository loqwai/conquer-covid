import React from 'react'

const useInterval = (fn: () => any, milliseconds: number, deps: any[] = []) => {
  React.useEffect(() => {
    const interval = setInterval(fn, milliseconds)
    return () => clearInterval(interval)
  // eslint-disable-next-line
  }, [fn, milliseconds, ...deps])
}

export default useInterval