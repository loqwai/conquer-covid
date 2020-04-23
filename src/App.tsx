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
  const [count, setCount] = React.useState(0)  
  const requestRef = React.useRef(0)
  const previousTimeRef = React.useRef(0)
  const animate = (time) => {  
      const deltaTime = time - previousTimeRef.current
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state
    setCount(prevCount => (prevCount + deltaTime * 0.01) % 100)    
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
  
  return (
    <div className="app">      
      <h1 className="time">{count}</h1>
    </div>
  )
}

export default App

