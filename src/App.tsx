import React from 'react'
import * as R from 'ramda'
import { Chance } from 'chance'
import * as Moment from 'moment'
import './App.css'
import Room, {createPerson} from './models/room'
// import {createPerson } from './models/room'
import useInterval from './hooks/useInterval'
import Town from './Town'

const chance = new Chance()
const moment = (Moment as any)
const popCount = 100
const roomCount = 20

const App = () => {  
  const [time, setTime] = React.useState(moment().unix())  
  const [rooms, setRooms] = React.useState<Room[]>([])
  
  React.useEffect(() => {
    const people = R.times(createPerson, popCount)
    chance.pickone(people).infected = true

    const roomPops = R.splitEvery(popCount / roomCount, people)
    const rooms = R.map(roomPop => {
      const bigness = chance.integer({ min: 100, max: 400 })
      return new Room(roomPop, { height: bigness, width: bigness })
    }, roomPops)

    setRooms(rooms)
  }, [])
  
  useInterval(() => {
    setTime(moment.unix(time).add(10, 'minutes').unix())  
  }, 1000)

  useInterval(() => {
    const r1 = chance.pickone(rooms)
    const r2 = chance.pickone(rooms)

    if (R.isEmpty(r1.getPeople())) return;
    const person = chance.pickone(r1.getPeople())
    r1.removePerson(person.id)
    r2.addPerson(person)    

    rooms.forEach(r => r.introduceEntropy())   
  }, 100)

  return (
    <>
      <h1>{moment.unix(time).format()}</h1>
      <Town rooms={rooms} />    
    </>
  )
}

export default App

