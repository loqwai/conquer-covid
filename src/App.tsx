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

  const [frameDelta, setFrameDelta] = React.useState<number>(performance.now())  

  const requestRef = React.useRef(0)
  const previousTimeRef = React.useRef(0)
  const game = React.useRef(new Game())
  
  React.useEffect(() => {    
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  React.useEffect(() => {
    console.log('frameDelta', frameDelta)
  }, [frame])

  const animate = (t) => {  
      console.log(frameDelta, t)
      const deltaTime = t - previousTimeRef.current  
      previousTimeRef.current = t
      setFrameDelta(deltaTime)
      setFrame(f => {
        console.log("frame", f)
        return f+1
      })
      requestRef.current = requestAnimationFrame(animate)
  }
  
  return (
    <div className="app">      
      <h1 className="time">{frame}</h1>
    </div>
  )
}

export default App

