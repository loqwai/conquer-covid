import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import './App.css'
import RoomsGrid from './RoomsGrid'
import Game from './ecs/Game'


const App = () => {
  const [frame, setFrame] = React.useState(0)
  const [delta, setDelta] = React.useState<number>(0)
  const [game, setGame] = React.useState<Game | undefined>(undefined)
  const requestRef = React.useRef(0)
  const previousTimeRef = React.useRef(0)

  React.useEffect(() => {
    setGame(new Game())
  }, [])

  // animation loop
  React.useEffect(() => {
    const animate = (t: number) => {
      const delta = t - previousTimeRef.current
      previousTimeRef.current = t
      setDelta(delta)
      setFrame(f => f + 1)
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  React.useEffect(() => {
    if(frame % 10 === 0) {
      game?.step(delta)
    }
  }, [game, frame, delta])

  return (
    <div className="app">
      <AutoSizer>
        {({width, height}) => {
          return width && height && (
            <UncontrolledReactSVGPanZoom
              width={width}
              height={height}
              tool="pan"
              customToolbar={() => null}
              customMiniature={() => null}
            >
              <svg className="world" viewBox={`0 0 ${Game.columnCount * Game.maxBigness} ${Game.rowCount * Game.maxBigness}`}>
                <RoomsGrid columnCount={Game.columnCount} rooms={game?.rooms} />
              </svg>
            </UncontrolledReactSVGPanZoom>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default App

