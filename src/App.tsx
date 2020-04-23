import React from 'react'
import * as R from 'ramda'
import AutoSizer from 'react-virtualized-auto-sizer'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom' 
import { Chance } from 'chance'
import * as Moment from 'moment'
import useInterval from '@use-it/interval'
import './App.css'
import Room, {createPerson} from './models/room'
import Town from './Town'

import Game from './ecs/game'

const moment = Moment as any
const chance = new Chance()

const App = () => {
  const [time, setTime] = React.useState("")
  const [frame, setFrame] = React.useState(0)
  const [delta, setDelta] = React.useState<number>(0)  

  const requestRef = React.useRef(0)
  const previousTimeRef = React.useRef(0)
  const gameContainer = React.useRef(new Game())
  
  React.useEffect(() => {    
    gameContainer.current.run()
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  React.useEffect(() => {
    const game = gameContainer.current
    game.step(delta)
    if( (frame%100) == 0){
      console.log("adding person")
      game.addPerson()
    }
  }, [frame])

  const animate = (t) => {        
      const delta = t - previousTimeRef.current
      previousTimeRef.current = t
      setDelta(delta)
      setFrame(f => f + 1)
      requestRef.current = requestAnimationFrame(animate)
  }
  
  return (
    <div className="app">      
      <h1 className="time">{frame}:{Number(delta).toFixed(4)}</h1>
    </div>
  )
}

export default App

