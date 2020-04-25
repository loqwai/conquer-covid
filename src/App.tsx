import React from 'react'
import * as R from 'ramda'
import AutoSizer from 'react-virtualized-auto-sizer'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { Chance } from 'chance'
import * as Moment from 'moment'
import useInterval from '@use-it/interval'
import './App.css'
import Room, {createPerson} from './models/room'
import RoomsGrid from './RoomsGrid'
import Game from './ecs/Game'

const moment = Moment as any

const App = () => {
  const [frame, setFrame] = React.useState(0)
  const [delta, setDelta] = React.useState<number>(0)
  const [time, setTime] = React.useState<number>(moment().unix())
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
    if(frame % 10 == 0) {
      game?.step(delta)
    }
  }, [game, frame, delta])

  useInterval(() => {
    setTime(t => moment.unix(t).add(10, 'minutes').unix())
  }, 1000)

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
      <h1 className="time">{moment.unix(time).format()}</h1>
    </div>
  )
}

export default App

