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
  const [time, setTime] = React.useState<number>(moment().unix())
  const [frameDelta, setFrameDelta] = React.useState<number>(performance.now())  
  const requestRef = React.useRef(0)
  const previousTimeRef = React.useRef(0)
  
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  const animate = (t) => {  
      console.log(frameDelta, t)
      const deltaTime = t - previousTimeRef.current  
      previousTimeRef.current = t
      requestRef.current = requestAnimationFrame(animate)
  }
  
  return (
    <div className="app">      
      <h1 className="time">{time}</h1>
    </div>
  )
}

export default App

