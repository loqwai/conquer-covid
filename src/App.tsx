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
const popCount = 90
const roomCount = 9
const columnCount = 3 
const maxBigness = 400

const rowCount = Math.floor(roomCount / columnCount)

const createRooms = () => {
  const people = R.times(createPerson, popCount)
  chance.pickone(people).infected = true
  const roomPops = R.splitEvery(popCount / roomCount, people)
  return R.map(roomPop => {
    const bigness = chance.integer({ min: 100, max: maxBigness })
    return new Room(roomPop, { height: bigness, width: bigness })
  }, roomPops)
}

const App = () => {
  const [time, setTime] = React.useState<number>(moment().unix())  
  const [rooms, setRooms] = React.useState<ReturnType<typeof createRooms>>([])

  React.useEffect(() => {
    setRooms(createRooms())
  }, [])

  useInterval(() => {
    setTime(t => moment.unix(t).add(10, 'minutes').unix())  
  }, 1000)

  useInterval(() => {
    const r1 = chance.pickone(rooms)
    const r2 = chance.pickone(rooms)

    if (R.isEmpty(r1.getPeople())) return

    const person = chance.pickone(r1.getPeople())
    r1.removePerson(person.id)
    r2.addPerson(person)    

    rooms.forEach(r => r.introduceEntropy())   
  }, 100)

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
              <svg className="world" viewBox={`0 0 ${columnCount * maxBigness} ${rowCount * maxBigness}`}>
                <Town columnCount={columnCount} rooms={rooms} />
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

