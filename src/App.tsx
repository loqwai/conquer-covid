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

const moment = Moment as any
const chance = new Chance()

const App = () => {  

  React.useEffect(() => {    
  }, [])
  
  return (
    <div className="app">      
      <h1 className="time">time goes here</h1>
    </div>
  )
}

export default App

