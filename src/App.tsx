import React from 'react'
import * as R from 'ramda'
import RoomComponent from './Room'
import AutoSizer from 'react-virtualized-auto-sizer'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom' 
import { Chance } from 'chance'
import * as Moment from 'moment'
import './App.css'
import Room, {createPerson} from './models/room'
import useInterval from './hooks/useInterval'
import useAnimationFrame from './hooks/useAnimationFrame'

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
  const [roomsData, setRoomsData] = React.useState(rooms.map(r => r.toData()))


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
  }, 1000, [rooms])

  useAnimationFrame(() => {
    setRoomsData(rooms.map(r => r.toData()))
  })

  return (
    <div className="app">
      <h1>{moment.unix(time).format()}</h1>
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
                {roomsData.map((room, i) => <RoomComponent key={i} {...room} row={Math.floor(i / columnCount)} column={i % columnCount} />)}
              </svg>
            </UncontrolledReactSVGPanZoom>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default App

