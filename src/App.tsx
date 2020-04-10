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
const popCount = 10
const roomCount = 1

const App = () => {  
  const [time, setTime] = React.useState(moment().unix())

  const people = R.times(createPerson, popCount)
  chance.pickone(people).infected = true
  const roomPops = R.splitEvery(popCount / roomCount, people)

  const rooms = R.map(roomPop => {
    const bigness = chance.integer({ min: 100, max: 400 })
    return new Room(roomPop, { height: bigness, width: bigness })
  }, roomPops)

  useInterval(() => {
    const r1 = chance.pickone(rooms)
    const r2 = chance.pickone(rooms)

    if (R.isEmpty(r1.getPeople())) return;
    const person = chance.pickone(r1.getPeople())
    r1.removePerson(person.id)
    r2.addPerson(person)    

    rooms.forEach(r => r.introduceEntropy())
    setTime(moment.unix(time).add(1, 'hours').unix())  
  }, 100)

  return (
    <>
    <h1>{moment.unix(time).format()}</h1>
    <Town rooms={rooms} />    
    </>
  )
}

export default App

