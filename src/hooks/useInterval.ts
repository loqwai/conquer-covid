import React from 'react'

type Fn = () => any;

const useInterval = (fn: Fn | undefined, milliseconds: number, deps: any[] = []) => {
  React.useEffect(() => {
    if (!fn) return;
    const interval = setInterval(fn, milliseconds)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [fn, milliseconds, ...deps])
}

export default useInterval