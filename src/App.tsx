import React from 'react'
import * as R from 'ramda'
import Room from './models/room'
import RoomComponent from './Room'
import { Chance } from 'chance'
import AutoSizer from 'react-virtualized-auto-sizer'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom' 
import './App.css'
import {createPerson } from './models/room'
import useInterval from './hooks/useInterval'
import useAnimationFrame from './hooks/useAnimationFrame'
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
  const [rooms, setRooms] = React.useState<ReturnType<typeof createRooms>>([])

  React.useEffect(() => {
    setRooms(createRooms())
  }, [])

  useInterval(() => {
    const r1 = chance.pickone(rooms)
    const r2 = chance.pickone(rooms)

    if (R.isEmpty(r1.getPeople())) return

    const person = chance.pickone(r1.getPeople())
    r1.removePerson(person.id)
    r2.addPerson(person)
  }, 100)

  useInterval(() => {
    rooms.forEach(r => r.introduceEntropy())
  }, 100)

  const [roomsData, setRoomsData] = React.useState(rooms.map(r => r.toData()))

  useAnimationFrame(() => {
    setRoomsData(rooms.map(r => r.toData()))
  })

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

