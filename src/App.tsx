import React from 'react'
import * as R from 'ramda'
import Room from './models/room'
import RoomComponent from './Room'
import { Chance } from 'chance'
import AutoSizer from 'react-virtualized-auto-sizer'
import { ReactSVGPanZoom, TOOL_AUTO } from 'react-svg-pan-zoom' 
import './App.css'
import {createPerson } from './models/room'
import useInterval from './hooks/useInterval'
import useAnimationFrame from './hooks/useAnimationFrame'
const chance = new Chance()

const popCount = 100
const roomCount = 25
const columnCount = 5

const createRooms = () => {
  const people = R.times(createPerson, popCount)
  chance.pickone(people).infected = true
  const roomPops = R.splitEvery(popCount / roomCount, people)
  return R.map(roomPop => {
    const bigness = chance.integer({ min: 100, max: 400 })
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

  const [tool, setTool] = React.useState(TOOL_AUTO)
  const [value, setValue] = React.useState({})

  useAnimationFrame(() => {
    setRoomsData(rooms.map(r => r.toData()))
  })

  return (
    <div className="app">
      <AutoSizer>
        {({width, height}) => {
          return width && height && (
            <ReactSVGPanZoom 
              tool={tool} 
              value={value}
              width={width}
              height={height}
              onChangeTool={setTool}
              onChangeValue={setValue}
            >
              <svg className="world" viewBox="0 0 1000 1000">
                {roomsData.map((room, i) => {
                  const column = i % columnCount
                  const row = Math.floor(i / columnCount)
                  return <RoomComponent key={i} row={row} column={column} {...room} />
                })}
              </svg>
            </ReactSVGPanZoom>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default App

