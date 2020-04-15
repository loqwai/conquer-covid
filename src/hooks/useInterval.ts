import React from 'react'

type Fn = () => any;

const useInterval = (fn: Fn | undefined, milliseconds: number, deps: any[] = []) => {
  // eslint-disable-next-line
  React.useEffect(() => {
    if (!fn) return
    const interval = setInterval(fn, milliseconds)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [milliseconds, ...deps])
}

export default useInterval